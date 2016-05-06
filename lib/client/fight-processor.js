'use strict';

/**
 * Expose `FightProcessor`.
 */
module.exports = FightProcessor;

/**
 * Initialize a new fight processor.
 */
function FightProcessor() {
}

FightProcessor.defineImplementedInterfaces(['fightProcessor']);

FightProcessor.defineDependency('_jquery', 'function');

/**
 * JQuery.
 *
 * @var {function}
 * @api public
 */
Object.defineProperty(FightProcessor.prototype, 'jquery', {
    set: function(jquery) { this._jquery = jquery; }
});

/**
 * @interface {fightProcessor}
 */
FightProcessor.prototype.check = function(fight) {
    return 0 !== this._jquery('#fight').length;
}

/**
 * @interface {fightProcessor}
 */
FightProcessor.prototype.process = function(fight) {
    var self = this,
        $ = this._jquery,
        frame = $('#fight')
    ;

    this._fight = fight;

    //$('#fight-link').click();

    var username = $('#player').find('.name').text(),
        player,
        opponent
    ;

    if (username === fight.player1.username) {
        player = fight.player1;
        opponent = fight.player2;
    }

    if (!frame.data('init')) {
        frame.find('.player1').find('.player')
            .css(
                'background-image',
                'url(http://ddragon.leagueoflegends.com/cdn/6.8.1/img/champion/{0}.png)'.format(
                    player.avatar
                )
            )
            .text(player.username)
        ;

        frame.find('.player2').find('.player')
            .css(
                'background-image',
                'url(http://ddragon.leagueoflegends.com/cdn/6.8.1/img/champion/{0}.png)'.format(
                    opponent.avatar
                )
            )
            .text(opponent.username)
        ;

        var countdown = frame.find('.countdown');

        setInterval(
            function() {
                var now = new Date(),
                    time = now.getTime()
                ;

                if (self._fight.phase) {
                    countdown.text(
                        Math.max(0, Math.round((self._fight.phase.time - time) / 1000))
                    );
                }
            },
            1000
        );
    }

    var now = new Date(),
        time = now.getTime()
    ;

    if (fight.phase) {
        switch (fight.phase.name) {
            case 'top':
                break;
            case 'jungle':
                break;
            case 'middle':
                break;
            case 'carry':
                break;
            case 'support':
                break;
            case 'fight':
                break;
            case 'end':
                break;
            default:
        }

        frame.find('.countdown').text(
            Math.max(0, Math.round((self._fight.phase.time - time) / 1000))
        );
        frame.find('.order').text(fight.phase.name);
    }

    frame.data('init', true);
}