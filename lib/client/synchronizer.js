'use strict';

/**
 * Expose `Synchronizer`.
 */
module.exports = Synchronizer;

/**
 * Initialize a new synchronizer.
 */
function Synchronizer() {
    this._diff = 0;
}

Synchronizer.defineImplementedInterfaces(['synchronizer']);

Synchronizer.defineDependency('_jquery', 'function');

/**
 * JQuery.
 *
 * @var {function}
 * @api public
 */
Object.defineProperty(Synchronizer.prototype, 'jquery', {
    set: function(jquery) { this._jquery = jquery; }
});

/**
 * @interface {synchronizer}
 */
Synchronizer.prototype.computeDiff = function() {
    var self = this,
        $ = this._jquery,
        timeFrame = $('div#time')
    ;

    timeFrame
        .each(function() {
            var now = new Date(),
                serverTime = parseInt($(this).text(), 10)
            ;

            self._diff = now.getTime() - serverTime;
        })
        .remove()
    ;
}

/**
 * @interface {synchronizer}
 */
Synchronizer.prototype.synchronize = function(time) {
    return time + this._diff;
}