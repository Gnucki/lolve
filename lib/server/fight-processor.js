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
    for (var i = 0; i < fights.length; i++) {
        var fight = fights[i];
    }
}