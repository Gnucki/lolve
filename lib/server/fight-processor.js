'use strict';

/**
 * Expose `FightProcessor`.
 */
module.exports = FightProcessor;

/**
 * Initialize a new fight processor.
 */
function FightProcessor() {
    this._count = 0;
}

FightProcessor.defineImplementedInterfaces(['fightProcessor']);

FightProcessor.defineDependency('_app', 'function');
FightProcessor.defineDependency('_logger', 'danf:logging.logger');
FightProcessor.defineDependency('_fightSequence', 'danf:sequencing.sequence');
FightProcessor.defineDependency('_dataContainer', 'dataContainer');

/**
 * Init.
 */
FightProcessor.prototype.__init = function() {
    setInterval(this.process.bind(this), 10000);
}

/**
 * Logger.
 *
 * @var {danf:logging.logger}
 * @api public
 */
Object.defineProperty(FightProcessor.prototype, 'logger', {
    set: function(logger) { this._logger = logger; }
});

/**
 * Fight sequence.
 *
 * @var {danf:sequencing.sequence}
 * @api public
 */
Object.defineProperty(FightProcessor.prototype, 'fightSequence', {
    set: function(fightSequence) { this._fightSequence = fightSequence; }
});

/**
 * App.
 *
 * @var {function}
 * @api public
 */
Object.defineProperty(FightProcessor.prototype, 'app', {
    set: function(app) { this._app = app; }
});

/**
 * Data Container.
 *
 * @var {dataContainer}
 * @api public
 */
Object.defineProperty(FightProcessor.prototype, 'dataContainer', {
    set: function(dataContainer) { this._dataContainer = dataContainer; }
});

/**
 * @interface {dataContainer}
 */
FightProcessor.prototype.process = function() {
    if (-1 !== this._app.context.listen.indexOf('http')) {
        var self = this,
            startTime = new Date()
        ;

        if (this._count > 1000000) {
            this._count = 0;
        } else {
            this._count++;
        }

        this._logger.log(
            '<<grey>>[{0}] <</grey>><<yellow>>Fight processing start <<grey>>[{1}]'.format(
                this._count,
                startTime.toLocaleTimeString()
            ),
            1
        );

        this._fightSequence.execute(
            {},
            {},
            '.',
            function(error) {
                console.log(error.message);
                console.log(error.stack);
            },
            function(stream) {
                var endTime = new Date();

                self._logger.log(
                    '<<grey>>[{0}] <</grey>><<yellow>>Fight processing end <<grey>>[{1}]({2} ms)'.format(
                        self._count,
                        endTime.toLocaleTimeString(),
                        endTime.getTime() - startTime.getTime()
                    ),
                    1
                );
            }
        );
    }
}

/**
 * @interface {dataContainer}
 */
FightProcessor.prototype.fight = function(fights) {
    var now = new Date(),
        time = now.getTime(),
        processedFights = [],
        number = 5,
        similarity = 3,
        top = 10,
        summoners = this._dataContainer.getSummoners()
    ;

    for (var i = 0; i < fights.length; i++) {
        var fight = fights[i];

        if (undefined === fight.phase) {
            fight.phase = {
                name: 'top',
                time: time
            }
            fight.phases = {};
        }

        if (fight.phase.time <= time) {
            switch (fight.phase.name) {
                case 'top':
                    fight.phase.name = 'jungle';
                    buildSummonerPhase(
                        summoners,
                        fight,
                        number,
                        similarity,
                        top
                    );

                    break;
                case 'jungle':
                    fight.phase.name = 'middle';
                    buildSummonerPhase(
                        summoners,
                        fight,
                        number,
                        similarity,
                        top
                    );

                    break;
                case 'middle':
                    fight.phase.name = 'carry';
                    buildSummonerPhase(
                        summoners,
                        fight,
                        number,
                        similarity,
                        top
                    );

                    break;
                case 'carry':
                    fight.phase.name = 'support';
                    buildSummonerPhase(
                        summoners,
                        fight,
                        number,
                        similarity,
                        top
                    );

                    break;
                case 'support':
                    fight.phase.name = 'fight';
                    break;
                case 'fight':
                    fight.phase.name = 'end';
                    break;
                case 'end':
                    break;
                default:
                    fight.phase.name = 'top';
                    buildSummonerPhase(
                        summoners,
                        fight,
                        number,
                        similarity,
                        top
                    );
            }

            fight.phase.time += 10000;

            processedFights.push(fight);
        }
    }

    return processedFights;
}

var buildSummonerPhase = function(summoners, fight, number, similarity, top) {
    var phaseName = fight.phase.name;

    fight.phases[phaseName] = {};

    var phaseData = fight.phases[phaseName];

    fight.phases[phaseName].summoners = findSummonersSet(
        summoners,
        phaseName,
        number,
        similarity,
        top
    );
}

var findSummonersSet = function(summoners, role, number, similarity, top) {
    var summonersSet = [];

    while (summonersSet.length < number) {
        var index = Math.floor(Math.random() * summoners.length),
            j = 0
        ;

        summonersSet = [];

        for (var i = index; j < summoners.length; j++) {
            var summoner = summoners[i];

            if (summoner.role === role) {
                if (checkSimilarity(summoner, summonersSet, similarity, top)) {
                    summonersSet.push({
                        role: summoner.role,
                        id: summoner.id,
                        name: summoner.name,
                        icon: summoner.profileIconId,
                        champions: summoner.championmastery.slice(0, top)
                    });
                }
            }

            if (summonersSet.length === number) {
                break;
            }
        }
    }

    return summonersSet;
};

var checkSimilarity = function(summoner, summoners, similarity, top) {
    for (var i = 0; i < summoners.length; i++) {
        var champions = summoners[i].champions,
            summonerSimilarity = 0
        ;

        for (var j = 0; j < top; j++) {
            var champion = champions[j];

            if (champion) {
                for (var k = 0; k < top; k++) {
                    var championmastery = summoner.championmastery[k];

                    if (championmastery && championmastery.championId === champion.championId) {
                        summonerSimilarity++;
                    }
                }
            }
        }

        if (summonerSimilarity < similarity) {
            return false;
        }
    }

    return true;
};