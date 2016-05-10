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
FightProcessor.defineDependency('_messenger', 'danf:tcp.messenger');
FightProcessor.defineDependency('_synchronizer', 'synchronizer');

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
 * Messenger.
 *
 * @var {danf:tcp.messenger}
 * @api public
 */
Object.defineProperty(FightProcessor.prototype, 'messenger', {
    set: function(messenger) { this._messenger = messenger; }
});

/**
 * Synchronizer.
 *
 * @var {synchronizer}
 * @api public
 */
Object.defineProperty(FightProcessor.prototype, 'synchronizer', {
    set: function(synchronizer) { this._synchronizer = synchronizer; }
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

    var username = $('#player').find('.name').text(),
        player,
        opponent,
        team,
        opponentTeam,
        playerFrame = frame.find('.player1'),
        opponentFrame = frame.find('.player2')
    ;

    if (username === fight.player1.username) {
        player = fight.player1;
        opponent = fight.player2;
        team = fight.team1;
        opponentTeam = fight.team2;
    } else {
        player = fight.player2;
        opponent = fight.player1;
        team = fight.team2;
        opponentTeam = fight.team1;
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

                if (self._fight.phase && self._fight.phase.time) {
                    var phaseTime = self._synchronizer.synchronize(self._fight.phase.time);

                    countdown.text(
                        Math.max(0, Math.round((phaseTime - time) / 1000))
                    );
                }
            },
            1000
        );
    }

    var now = new Date(),
        time = now.getTime(),
        countdownValue = '-',
        order = 'Waiting for the fight to start...'
    ;

    if (fight.phase) {
        switch (fight.phase.name) {
            case 'top':
            case 'jungle':
            case 'middle':
            case 'carry':
            case 'support':
                order = 'Click on the summoner icons to see their champions mastery.<br />' +
                    'A random champion will be picked at the end (from the list of common champions of your summoner and your opponent one).<br />' +
                    'The biggest mastery will win the lane.'
                ;

                break;
            case 'fight':
                order = 'Let\'s fight now !';

                break;
            case 'end':
                order = 'The battle is over.<br />' +
                    'The winner is the one who win most lanes.<br />' +
                    'In case of equality, the winner is the one with most mastery points.'
                ;

                break;
        }

        if (self._fight.phase.time) {
            var phaseTime = this._synchronizer.synchronize(self._fight.phase.time);

            countdownValue = Math.max(0, Math.round((phaseTime - time) / 1000));
        }
    }

    frame.find('.countdown').text(countdownValue);
    frame.find('.order').html(order);

    if (fight.game) {
        var gameFrame = frame.find('.game');

        gameFrame
            .html(fight.game)
            .find('.summoner')
                .click(function() {
                    var summonerImg = $(this),
                        summonerData = summonerImg.data('summoner')
                    ;

                    gameFrame.find('.summoner').removeClass('selected');

                    gameFrame.find('.summoner-detail').each(function() {
                        var summonerDetailFrame = $(this),
                            summonerDetailData = summonerDetailFrame.data('summoner')
                        ;

                        if (summonerData.id === summonerDetailData.id) {
                            summonerDetailFrame.show();
                            summonerImg.addClass('selected');
                        } else {
                            summonerDetailFrame.hide();
                        }
                    });
                })
                .eq(0).click()
        ;

        var buttons = gameFrame.find('.summoner-detail button');

        buttons.click(function() {
            self._messenger.emit(
                'main:summonerChoice',
                {
                    number: $(this).data('number'),
                    role: fight.phase.name
                }
            );
        });

        if (fight.phase && team && team[fight.phase.name]) {
            buttons.addClass('disabled');

            gameFrame.find('.summoners .summoner').eq(team[fight.phase.name].summoner).addClass('player');
        }
        if (fight.phase && opponentTeam && opponentTeam[fight.phase.name]) {
            gameFrame.find('.summoners .summoner').eq(team[fight.phase.name].summoner).addClass('opponent');
        }

        if (fight.fight) {
            var score,
                opponentScore
            ;

            if (username === fight.player1.username) {
                score = fight.fight.player1;
                opponentScore = fight.fight.player2;
            } else {
                score = fight.fight.player2;
                opponentScore = fight.fight.player1;
            }

            if (score.win) {
                gameFrame.find('.win').css('display', 'block');
                gameFrame.find('.lose').remove();
            } else {
                gameFrame.find('.lose').css('display', 'block');
                gameFrame.find('.win').remove();
            }

            var totalPoints = 0,
                totalOpponentPoints = 0
            ;

            for (var laneName in score.lanes) {
                var lane = score.lanes[laneName],
                    laneElement = gameFrame.find('.lane.' + laneName),
                    laneImgElement = laneElement.find('.img'),
                    scoreElement = laneElement.find('.score1'),
                    opponentScoreElement = laneElement.find('.score2')
                ;

                for (var i = 0; i < lane.champions.length; i++) {
                    laneImgElement.append(
                        '<img src="http://ddragon.leagueoflegends.com/cdn/6.8.1/img/champion/{0}.png" />'.format(
                            lane.champions[i].key
                        )
                    )
                }

                var points = lane.points,
                    opponentPoints = opponentScore.lanes[laneName].points
                ;

                totalPoints += points;
                totalOpponentPoints += opponentPoints;

                scoreElement.html('<strong>{0} </strong> ({1})'.format(
                    points,
                    totalPoints
                ));
                opponentScoreElement.html('<strong>{0} </strong> ({1})'.format(
                    opponentPoints,
                    totalOpponentPoints
                ));

                if (points > opponentPoints) {
                    scoreElement.addClass('win');
                    opponentScoreElement.addClass('lose');
                } else if (points < opponentPoints) {
                    opponentScoreElement.addClass('win');
                    scoreElement.addClass('lose');
                }
            }

            var lines = gameFrame.find('.line'),
                linesNumber = lines.length
            ;

            lines.each(function(index) {
                var lineItems = $(this).find('.line-item');
                lineItems.delay(index * 1000).fadeOut(0, function() {
                    $(this).css('visibility', 'visible');
                }).fadeIn(1000);
            });

            gameFrame.find('.back-home').click(function(event) {
                $('#back-home').click();

                event.stopPropagation();
                event.preventDefault();
            });
        }

        if (team) {
            for (var role in team) {
                var phase = fight.phases[role];

                if (phase) {
                    var summoner = phase.summoners[team[role].summoner];

                    playerFrame.find('.' + role).html(
                        '<img src="http://ddragon.leagueoflegends.com/cdn/6.9.1/img/profileicon/' + summoner.icon + '.png" />'
                    );
                } else {
                    playerFrame.find('.' + role).html('');
                }
            }
        }

        if (opponentTeam) {
            for (var role in opponentTeam) {
                var phase = fight.phases[role];

                if (phase) {
                    var summoner = phase.summoners[opponentTeam[role].summoner];

                    opponentFrame.find('.' + role).html(
                        '<img src="http://ddragon.leagueoflegends.com/cdn/6.9.1/img/profileicon/' + summoner.icon + '.png" />'
                    );
                } else {
                    opponentFrame.find('.' + role).html('');
                }
            }
        }
    }

    frame.data('init', true);
}