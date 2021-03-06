'use strict';

/**
 * Expose `DataContainer`.
 */
module.exports = DataContainer;

/**
 * Initialize a new data container.
 */
function DataContainer() {
}

DataContainer.defineImplementedInterfaces(['dataContainer']);

DataContainer.defineDependency('_app', 'function');
DataContainer.defineDependency('_logger', 'danf:logging.logger');
DataContainer.defineDependency('_loadSequence', 'danf:sequencing.sequence');
DataContainer.defineDependency('_db', 'gnuckiMongodb:db');

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
 * Database.
 *
 * @var {gnuckiMongodb:db}
 * @api public
 */
Object.defineProperty(DataContainer.prototype, 'db', {
    set: function(db) { this._db = db; }
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
                    this._champions = stream.champions;
                    this._indexedChampions = {};

                    for (var key in this._champions) {
                        var champion = this._champions[key];

                        this._indexedChampions[champion.id] = champion;
                    }

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

                    console.log(roles);
                })
            );
        });
    }
}

/**
 * @interface {dataContainer}
 */
DataContainer.prototype.getSummoners = function() {
    if (!this._summoners) {
        this.__asyncProcess(function(async) {
            var self = this;

            setTimeout(function() {
                var summonersCollection = self._db.collections.summoners;

                summonersCollection.find({}).batchSize(2000).toArray(async(function(error, summoners) {
                    if (error) {
                        throw error;
                    }

                    this._summoners = summoners;

                    return summoners;
                }));
            }, 5000);
        });
    }

    return this._summoners;
}

/**
 * @interface {dataContainer}
 */
DataContainer.prototype.getChampions = function(indexed) {
    return indexed
        ? this._indexedChampions
        : this._champions
    ;
}

/**
 * @interface {dataContainer}
 */
DataContainer.prototype.getWaiters = function() {
    var waitersCollection = this._db.collections.waiters;

    this.__asyncProcess(function(async) {
        waitersCollection.find({}).batchSize(1000).toArray(async(function(error, waiters) {
            if (error) {
                throw error;
            }

            return waiters;
        }));
    });
}

/**
 * @interface {dataContainer}
 */
DataContainer.prototype.getFights = function() {
    var fightsCollection = this._db.collections.fights;

    this.__asyncProcess(function(async) {
        fightsCollection.find({}).batchSize(1000).toArray(async(function(error, fights) {
            if (error) {
                throw error;
            }

            return fights;
        }));
    });
}