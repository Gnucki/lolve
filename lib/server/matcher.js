'use strict';

/**
 * Expose `Matcher`.
 */
module.exports = Matcher;

/**
 * Initialize a new matcher.
 */
function Matcher() {
    this._count = 0;
}

Matcher.defineImplementedInterfaces(['matcher']);

Matcher.defineDependency('_app', 'function');
Matcher.defineDependency('_logger', 'danf:logging.logger');
Matcher.defineDependency('_matchSequence', 'danf:sequencing.sequence');

/**
 * Init.
 */
Matcher.prototype.__init = function() {
    setInterval(this.process.bind(this), 10000);
}

/**
 * Logger.
 *
 * @var {danf:logging.logger}
 * @api public
 */
Object.defineProperty(Matcher.prototype, 'logger', {
    set: function(logger) { this._logger = logger; }
});

/**
 * Match sequence.
 *
 * @var {danf:sequencing.sequence}
 * @api public
 */
Object.defineProperty(Matcher.prototype, 'matchSequence', {
    set: function(matchSequence) { this._matchSequence = matchSequence; }
});

/**
 * App.
 *
 * @var {function}
 * @api public
 */
Object.defineProperty(Matcher.prototype, 'app', {
    set: function(app) { this._app = app; }
});

/**
 * @interface {dataContainer}
 */
Matcher.prototype.process = function() {
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
            '<<grey>>[{0}] <</grey>><<yellow>>Match processing start <<grey>>[{1}]'.format(
                this._count,
                startTime.toLocaleTimeString()
            ),
            1
        );

        this._matchSequence.execute(
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
                    '<<grey>>[{0}] <</grey>><<yellow>>Match processing end <<grey>>[{1}]({2} ms)'.format(
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
Matcher.prototype.match = function(waiters) {
    for (var i = 0; i < waiters.length; i++) {
        var waiter = waiters[i];
    }
}