'use strict';

/**
 * Expose `FightProcessor`.
 */
module.exports = FightProcessor;

/**
 * Module dependencies.
 */
var path = require('path'),
    jade = require('jade')
;

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
    this._renderGame = jade.compileFile(
        path.join(__dirname, '/../../resource/private/view/game.jade'),
        {}
    );

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
 * @interface {fightProcessor}
 */
FightProcessor.prototype.process = function() {
    if (-1 !== this._app.context.listen.indexOf('http')) {
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
            2
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
                    2
                );
            }
        );
    }
}

/**
 * @interface {fightProcessor}
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
                name: 'start',
                time: time
            }
            fight.phases = {};
        }

        if (fight.phase.time <= time) {
            fight.phase.time = time + 30000;

            switch (fight.phase.name) {
                case 'top':
                    checkSummonerChoice(
                        fight,
                        number
                    );
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
                    checkSummonerChoice(
                        fight,
                        number
                    );
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
                    checkSummonerChoice(
                        fight,
                        number
                    );
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
                    checkSummonerChoice(
                        fight,
                        number
                    );
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
                    checkSummonerChoice(
                        fight,
                        number
                    );
                    fight.phase.name = 'fight';
                    processFight(
                        fight,
                        this._dataContainer.getChampions(true)
                    );
                    fight.phase.time = 0;

                    break;
                case 'fight':
                    fight.ended = true;

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

            processedFights.push(fight);
        }
    }

    return processedFights;
}

/**
 * @interface {fightProcessor}
 */
FightProcessor.prototype.chooseSummoner = function(number, role, fight, player) {
    var team,
        opponentTeam
    ;

    if (player.username === fight.player1) {
        if (null == fight.team1) {
            fight.team1 = {};
        }

        team = fight.team1;
        opponentTeam = fight.team2;
    } else {
        if (null == fight.team2) {
            fight.team2 = {};
        }

        team = fight.team2;
        opponentTeam = fight.team1;
    }

    // Prevent changing summoner choice.
    if (team[role]) {
        return;
    }

    var now = new Date();

    // Prevent choosing the same summoner as its opponent.
    if (
        opponentTeam &&
        opponentTeam[role] &&
        opponentTeam[role].summoner === number
    ) {
        return;
    }

    team[role] = {
        summoner: number,
        time: now.getTime()
    };

    return fight;
}

/**
 * @interface {fightProcessor}
 */
FightProcessor.prototype.render = function(fight) {
    return this._renderGame({
        fight: fight,
        champions: this._dataContainer.getChampions(true)
    });
}

var processFight = function(fight, champions) {
    fight.champions = {};

    for (var role in fight.phases) {
        var phase = fight.phases[role],
            summonerIndex1 = fight.team1[role].summoner,
            summoner1 = phase.summoners[summonerIndex1],
            summonerIndex2 = fight.team2[role].summoner,
            summoner2 = phase.summoners[summonerIndex2],
            commonChampions = []
        ;

        for (var i = 0; i < summoner1.champions.length; i++) {
            var champion1 = summoner1.champions[i];

            for (var j = 0; j < summoner2.champions.length; j++) {
                var champion2 = summoner2.champions[j];

                if (champion1.championId === champion2.championId) {
                    commonChampions.push({
                        player1: champion1,
                        player2: champion2
                    });
                }
            }
        }

        var index = Math.floor(Math.random() * commonChampions.length);

        fight.champions[role] = commonChampions[index];
    }

    var lanes = {
            top: 'top',
            jungle: 'jungle',
            middle: 'middle',
            carry: 'bot',
            support: 'bot'
        },
        scores = {
            player1: {
                lanes: {},
                wins: 0,
                points: 0
            },
            player2: {
                lanes: {},
                wins: 0,
                points: 0
            }
        }
    ;

    for (var role in fight.champions) {
        var champion1 = fight.champions[role].player1,
            champion2 = fight.champions[role].player2,
            lane = lanes[role]
        ;

        if (null == scores.player1.lanes[lane]) {
            scores.player1.lanes[lane] = {
                champions: []
            };
        }
        if (null == scores.player2.lanes[lane]) {
            scores.player2.lanes[lane] = {
                champions: []
            };
        }

        scores.player1.lanes[lane].champions.push({
            id: champion1.championId,
            key: champions[champion1.championId].key,
            name: champions[champion1.championId].name,
            points: champion1.championPoints
        });
        scores.player2.lanes[lane].champions.push({
            id: champion2.championId,
            key: champions[champion2.championId].key,
            name: champions[champion2.championId].name,
            points: champion2.championPoints
        });

        scores.player1.points += champion1.championPoints;
        scores.player2.points += champion2.championPoints;
    }

    lanes = ['top', 'jungle', 'middle', 'bot'];

    for (var i = 0; i < lanes.length; i++) {
        var lane = lanes[i],
            lane1 = scores.player1.lanes[lane],
            lane2 = scores.player2.lanes[lane],
            points1 = 0,
            points2 = 0
        ;

        for (var j = 0; j < lane1.champions.length; j++) {
            points1 += lane1.champions[j].points;
        }
        for (var j = 0; j < lane2.champions.length; j++) {
            points2 += lane2.champions[j].points;
        }

        lane1.points = points1;
        lane2.points = points2;

        if (points1 < points2) {
            lane1.win = false;
            lane2.win = true;
        } else if (points1 > points2) {
            lane1.win = true;
            lane2.win = false;
        } else {
            lane1.win = false;
            lane2.win = false;
        }

        if (lane1.win) {
            scores.player1.wins++;
        }
        if (lane2.win) {
            scores.player2.wins++;
        }
    }

    if (scores.player1.wins < scores.player2.wins) {
        scores.player1.win = false;
        scores.player2.win = true;
    } else if (scores.player1.wins > scores.player2.wins) {
        scores.player1.win = true;
        scores.player2.win = false;
    } else if (scores.player1.points < scores.player2.points) {
        scores.player1.win = false;
        scores.player2.win = true;
    } else {
        scores.player1.win = true;
        scores.player2.win = false;
    }

    fight.fight = scores;
}

var checkSummonerChoice = function(fight, number) {
    var role = fight.phase.name,
        alreadyChoosen = {},
        now = new Date()
    ;

    if (null == fight.team1) {
        fight.team1 = {};
    }
    if (null == fight.team2) {
        fight.team2 = {};
    }

    if (null != fight.team1[role]) {
        alreadyChoosen[fight.team1[role].summoner] = true;
    }

    if (null != fight.team2[role]) {
        alreadyChoosen[fight.team2[role].summoner] = true;
    }

    if (null == fight.team1[role]) {
        var index = -1;

        while (-1 === index || index in alreadyChoosen) {
            index = Math.floor(Math.random() * number);
        }

        fight.team1[role] = {
            summoner: index,
            time: now.getTime()
        };

        alreadyChoosen[index] = true;
    }

    if (null == fight.team2[role]) {
        var index = -1;

        while (-1 === index || index in alreadyChoosen) {
            index = Math.floor(Math.random() * number);
        }

        fight.team2[role] = {
            summoner: index,
            time: now.getTime()
        };
    }
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

        for (var i = index; j < summoners.length; j++, i++) {
            var summoner = summoners[i];

            if (
                summoner &&
                summoner.role === role &&
                summoner.name &&
                -1 === summoner.name.indexOf('@') &&
                -1 === summoner.name.indexOf('!')
            ) {
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