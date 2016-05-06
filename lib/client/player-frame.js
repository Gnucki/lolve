'use strict';

/**
 * Expose `PlayerFrame`.
 */
module.exports = PlayerFrame;

/**
 * Initialize a new player frame.
 */
function PlayerFrame() {
}

PlayerFrame.defineImplementedInterfaces(['playerFrame']);

PlayerFrame.defineDependency('_jquery', 'function');

/**
 * JQuery.
 *
 * @var {function}
 * @api public
 */
Object.defineProperty(PlayerFrame.prototype, 'jquery', {
    set: function(jquery) { this._jquery = jquery; }
});

/**
 * @interface {playerFrame}
 */
PlayerFrame.prototype.getUsername = function() {
    var $ = this._jquery,
        frame = $('#player')
    ;

    return frame.find('.name').text();
}

/**
 * @interface {playerFrame}
 */
PlayerFrame.prototype.update = function(player) {
    var $ = this._jquery,
        frame = $('#player')
    ;

    if (player) {
        frame.slideDown(200);
        frame.find('.name').text(player.username);
        frame.find('.win .quantity').text(1);
        frame.find('.lose .quantity').text(0);
    } else {
        frame.slideUp(200, function() {
            frame.find('.name').text('');
            frame.find('.win .quantity').text(0);
            frame.find('.lose .quantity').text(0);
        });
    }

    frame.find('.loader').remove();
}