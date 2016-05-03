'use strict';

/**
 * Expose `Selector`.
 */
module.exports = Selector;

/**
 * Initialize a new selector.
 */
function Selector() {
}

Selector.defineImplementedInterfaces(['selector']);

Selector.defineDependency('_jquery', 'function');

/**
 * JQuery.
 *
 * @var {function}
 * @api public
 */
Object.defineProperty(Selector.prototype, 'jquery', {
    set: function(jquery) { this._jquery = jquery; }
});

/**
 * @interface {dataContainer}
 */
Selector.prototype.selectAvatar = function(image) {
    var $ = this._jquery,
        source = 'string' === typeof image
            ? image
            : $(image).attr('src')
    ;

    var match = source.match(/\/([^\/.]+)\.png$/);

    $('input[name="avatar"]').each(function() {
        var self = $(this),
            form = self.closest('form')
        ;

        form.find('img.avatar').attr('src', source);
        self.val(match[1]);
    });
}