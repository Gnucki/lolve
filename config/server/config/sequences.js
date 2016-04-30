'use strict';

/**
 * @see https://github.com/gnodi/danf/blob/master/resource/private/doc/documentation/core/sequencing.md
 */
module.exports = {
    loadHome: {
        operations: [
            {
                order: 0,
                service: 'danf:http.router',
                method: 'get',
                arguments: [
                    '[-]lolApi.staticData.champion'
                ],
                scope: 'route'
            },
            {
                order: 1,
                service: 'danf:manipulation.proxyExecutor',
                method: 'execute',
                arguments: [
                    '@route@',
                    'follow',
                    {
                        api_key: '$lol.api.key$',
                        region: 'euw'
                    },
                    {},
                    {
                        protocol: '$lol.api.protocol$'
                    }
                ],
                scope: 'responses.champions'
            },
            {
                order: 2,
                service: 'danf:manipulation.proxyExecutor',
                method: 'execute',
                arguments: [
                    {
                        parse: JSON.parse
                    },
                    'parse',
                    '@responses.champions@'
                ],
                scope: 'champions'
            }/*,
            {
                order: 10,
                service: 'danf:http.router',
                method: 'get',
                arguments: [
                    '[-]lolApi.league.challenger'
                ],
                scope: 'route'
            },
            {
                order: 11,
                service: 'danf:manipulation.proxyExecutor',
                method: 'execute',
                arguments: [
                    '@route@',
                    'follow',
                    {
                        api_key: '$lol.api.key$',
                        region: 'euw',
                        type: 'RANKED_SOLO_5x5'
                    },
                    {},
                    {
                        protocol: '$lol.api.protocol$'
                    }
                ],
                scope: 'responses.summoners'
            }*/
        ]
    },
    load: {
        operations: [
            {
                order: 0,
                service: 'danf:http.router',
                method: 'get',
                arguments: [
                    '[-]lolApi.league.challenger'
                ],
                scope: 'route'
            },
            {
                order: 1,
                service: 'danf:manipulation.proxyExecutor',
                method: 'execute',
                arguments: [
                    '@route@',
                    'follow',
                    {
                        api_key: '$lol.api.key$',
                        region: 'euw',
                        type: 'RANKED_SOLO_5x5'
                    },
                    {},
                    {
                        protocol: '$lol.api.protocol$'
                    }
                ],
                scope: 'summoners'
            },
            {
                order: 2,
                service: 'danf:manipulation.proxyExecutor',
                method: 'execute',
                arguments: [
                    {
                        parse: JSON.parse
                    },
                    'parse',
                    '@summoners@'
                ],
                scope: 'summoners'
            },
            {
                order: 2,
                service: 'danf:http.router',
                method: 'get',
                arguments: [
                    '[-]lolApi.game.summonerRecent'
                ],
                scope: 'route'
            }
        ],
        children: [
            {
                order: 3,
                name: 'loadSummoner',
                input: {
                    route: '@route@',
                    summoner: '@@.@@'
                },
                collection: {
                    input: '@summoners.entries@',
                    method: '|-',
                    parameters: {
                        limit: 5
                    },
                    aggregate: function(stream) {
                        var summoners = [];

                        for (var i = 0; i < stream.length; i++) {
                            summoners.push(stream[i].summoner);
                        }

                        return {summoners: summoners};
                    }
                },
                output: {
                    summoners: '@summoners@'
                }
            }
        ]
    },
    loadSummoner: {
        operations: [
            {
                order: 0,
                service: 'danf:manipulation.proxyExecutor',
                method: 'execute',
                arguments: [
                    '@route@',
                    'follow',
                    {
                        api_key: '%lol.api.key%',
                        region: 'euw',
                        summoner: '@summoner.playerOrTeamId@'
                    },
                    {},
                    {
                        protocol: '%lol.api.protocol%'
                    }
                ],
                scope: 'games'
            },
            {
                order: 1,
                service: 'danf:manipulation.proxyExecutor',
                method: 'execute',
                arguments: [
                    {
                        parse: JSON.parse
                    },
                    'parse',
                    '@games@'
                ],
                scope: 'games'
            },
            {
                order: 2,
                service: 'summonerRoleDeterminer',
                method: 'determine',
                arguments: ['@summoner@', '@games.games@'],
                scope: 'summoner.role'
            }
        ]
    }
};