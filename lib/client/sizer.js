'use strict';

/**
 * Expose `Sizer`.
 */
module.exports = Sizer;

/**
 * Initialize a new sizer.
 */
function Sizer() {
}

Sizer.defineImplementedInterfaces(['sizer']);

Sizer.defineDependency('_jquery', 'function');

/**
 * JQuery.
 *
 * @var {function}
 * @api public
 */
Object.defineProperty(Sizer.prototype, 'jquery', {
    set: function(jquery) { this._jquery = jquery; }
});

/**
 * @interface {dataContainer}
 */
Sizer.prototype.resize = function() {
    var $ = this._jquery;

    // ...
}