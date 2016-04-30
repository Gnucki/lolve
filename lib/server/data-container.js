'use strict';

/**
 * Expose `DataContainer`.
 */
module.exports = DataContainer;

/**
 * Initialize a new data container.
 */
function DataContainer() {
    this._summoners = {};
}

DataContainer.defineImplementedInterfaces(['dataContainer']);

DataContainer.defineDependency('_app', 'function');
DataContainer.defineDependency('_logger', 'danf:logging.logger');
DataContainer.defineDependency('_loadSequence', 'danf:sequencing.sequence');

/**
 * Init.
 */
DataContainer.prototype.__init = function() {
    this.load();
}

/**
 * Logger.
 *
 * @var {danf:logging.logger}
 * @api public
 */
Object.defineProperty(DataContainer.prototype, 'logger', {
    set: function(logger) { this._logger = logger; }
});

/**
 * Load sequence.
 *
 * @var {danf:sequencing.sequence}
 * @api public
 */
Object.defineProperty(DataContainer.prototype, 'loadSequence', {
    set: function(loadSequence) { this._loadSequence = loadSequence; }
});

/**
 * App.
 *
 * @var {function}
 * @api public
 */
Object.defineProperty(DataContainer.prototype, 'app', {
    set: function(app) { this._app = app; }
});

/**
 * @interface {dataContainer}
 */
DataContainer.prototype.load = function(data) {
    if (-1 !== this._app.context.listen.indexOf('http')) {
        this.__asyncProcess(function(async) {
            this._logger.log(
                '<<bold>><<magenta>>Data<</bold>> fetching...',
                1
            );

            this._loadSequence.execute(
                {},
                {},
                '.',
                function(error) {
                    console.log(error.message);
                    console.log(error.stack);

                    throw error;
                },
                async(function(stream) {
                    this._summoners = stream.summoners;

                    var roles = {
                            top: 0,
                            jungle: 0,
                            middle: 0,
                            carry: 0,
                            support: 0
                        }
                    ;

                    for (var i = 0; i < this._summoners.length; i++) {
                        roles[this._summoners[i].role]++;
                    }

                    console.log(this._summoners, '.........', roles);
                })
            );
        });
    }
}