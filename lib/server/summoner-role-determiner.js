'use strict';

/**
 * Expose `SummonerRoleDeterminer`.
 */
module.exports = SummonerRoleDeterminer;

/**
 * Initialize a new summoner role determiner.
 */
function SummonerRoleDeterminer() {
}

SummonerRoleDeterminer.defineImplementedInterfaces(['summonerRoleDeterminer']);

/**
 * @interface {summonerRoleDeterminer}
 */
SummonerRoleDeterminer.prototype.determine = function(summoner, games) {
    var roles = {
            top: 0,
            jungle: 0,
            middle: 0,
            carry: 0,
            support: 0
        }
    ;

    for (var i = 0; i < games.length; i++) {
        var game = games[i].stats;

        if (1 === game.playerPosition) {
            roles.top++;
        } else if (2 === game.playerPosition) {
            roles.middle++;
        } else if (3 === game.playerPosition) {
            roles.jungle++;
        } else if (3 === game.playerRole) {
            roles.carry++;
        } else if (2 === game.playerRole) {
            roles.support++;
        }
    }

    var max = 0,
        role = 'jungle'
    ;

    for (var key in roles) {
        if (roles[key] > max) {
            max = roles[key];
            role = key;
        }
    }

    return role;
}