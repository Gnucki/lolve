'use strict';

/**
 * @see https://github.com/gnodi/danf/blob/master/resource/private/doc/documentation/core/events.md
 */
module.exports = {
    championmastery: {
        host: 'euw.api.pvp.net:443',
        path: '/championmastery/location/:platform/player/:player',
        methods: ['GET'],
        children: {
            topchampions: {
                path: '/topchampions'
            }
        }
    },
    game: {
        host: 'euw.api.pvp.net:443',
        path: '/api/lol/:region/%lol.api.chunks.game.version%',
        methods: ['GET'],
        children: {
            summonerRecent: {
                path: '/by-summoner/:summoner/recent'
            }
        }
    },
    league: {
        host: 'euw.api.pvp.net:443',
        path: '/api/lol/:region/%lol.api.chunks.league.version%/league',
        methods: ['GET'],
        children: {
            challenger: {
                path: '/challenger'
            }
        }
    },
    staticData: {
        path: '/api/lol/static-data/:region/%lol.api.chunks.staticData.version%',
        methods: ['GET'],
        children: {
            champion: {
                path: '/champion'
            }
        }
    }
};