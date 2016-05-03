'use strict';

var crypto = require('crypto'),
    encodePassword = function(password) {
        crypto.pbkdf2Sync('secret', 'salt', 100000, 512, 'sha512')
    }
;

/**
 * @see https://github.com/gnodi/danf/blob/master/resource/private/doc/documentation/core/sequencing.md
 */
module.exports = {
    loadChampions: {
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
            }
        ]
    },
    checkLogin: {
        children: [
            {
                order: 0,
                condition: function(stream, context) {
                    return null == context.request.session.player;
                },
                name: 'redirectLogin'
            }
        ]
    },
    redirectLogin: {
        operations: [
            {
                order: 0,
                service: 'danf:http.router',
                method: 'find',
                arguments: [
                    '!request.url!',
                    '!request.method!'
                ],
                scope: 'originRoute'
            },
            {
                order: 0,
                service: 'danf:http.router',
                method: 'get',
                arguments: ['[-]login'],
                scope: 'loginRoute'
            },
            {
                order: 1,
                service: 'danf:manipulation.proxyExecutor',
                method: 'execute',
                arguments: [
                    '@originRoute@',
                    'resolve',
                    {}
                ],
                scope: 'originUrl'
            },
            {
                order: 2,
                service: 'danf:manipulation.proxyExecutor',
                method: 'execute',
                arguments: [
                    '@loginRoute@',
                    'resolve',
                    {
                        origin: '@originUrl@'
                    }
                ],
                scope: 'loginUrl'
            },
            {
                condition: function(stream) {
                    console.log('-------', stream);

                    return true;
                },
                order: 3,
                service: 'danf:http.redirector',
                method: 'redirect',
                arguments: ['@loginUrl@']
            }
        ]
    },
    login: {
        stream: {
            username: {
                type: 'string',
                required: true
            },
            password: {
                type: 'string',
                required: true
            },
            origin: {
                type: 'string',
                default: 'home'
            }
        },
        operations: [
            {
                order: -1,
                service: 'danf:http.sessionHandler',
                method: 'set',
                arguments: [
                    'player',
                    null
                ]
            },
            {
                order: -1,
                service: 'danf:http.sessionHandler',
                method: 'set',
                arguments: [
                    'loginError',
                    null
                ]
            },
            {
                order: 0,
                service: 'passwordEncoder',
                method: 'encode',
                arguments: ['@password@'],
                scope: 'password'
            },
            {
                order: 1,
                service: 'gnuckiMongodb:db.main.collection.players',
                method: 'findOne',
                arguments: [
                    {
                        username: '@username@'
                    }
                ],
                scope: 'player'
            },
            {
                order: 2,
                condition: function(stream) {
                    return null == stream.player;
                },
                service: 'danf:http.sessionHandler',
                method: 'set',
                arguments: [
                    'loginError',
                    'No player "@username@" found'
                ]
            },
            {
                order: 3,
                condition: function(stream) {
                    return null == stream.player;
                },
                service: 'danf:http.redirector',
                method: 'redirect',
                arguments: ['!request.url!']
            },
            {
                order: 4,
                condition: function(stream) {
                    return stream.player.password !== stream.password;
                },
                service: 'danf:http.sessionHandler',
                method: 'set',
                arguments: [
                    'loginError',
                    'Bad credentials'
                ]
            },
            {
                order: 5,
                condition: function(stream) {
                    return stream.player.password !== stream.password;
                },
                service: 'danf:http.redirector',
                method: 'redirect',
                arguments: ['!request.url!']
            },
            {
                order: 6,
                service: 'danf:http.sessionHandler',
                method: 'set',
                arguments: [
                    'player',
                    '@player@'
                ]
            },
            {
                order: 7,
                service: 'danf:http.router',
                method: 'get',
                arguments: ['[-]@origin@'],
                scope: 'originRoute'
            },
            {
                order: 8,
                service: 'danf:manipulation.proxyExecutor',
                method: 'execute',
                arguments: [
                    '@originRoute@',
                    'resolve',
                    {}
                ],
                scope: 'originUrl'
            },
            {
                order: 9,
                service: 'danf:http.redirector',
                method: 'redirect',
                arguments: ['@originUrl@']
            }
        ]
    },
    logout: {
        stream: {},
        operations: [
            {
                order: 0,
                service: 'danf:http.sessionHandler',
                method: 'set',
                arguments: [
                    'player',
                    null
                ]
            },
            {
                order: 1,
                service: 'danf:http.router',
                method: 'get',
                arguments: ['[-]home'],
                scope: 'route'
            },
            {
                order: 2,
                service: 'danf:manipulation.proxyExecutor',
                method: 'execute',
                arguments: [
                    '@route@',
                    'resolve',
                    {}
                ],
                scope: 'url'
            },
            {
                order: 3,
                service: 'danf:http.redirector',
                method: 'redirect',
                arguments: ['@url@']
            }
        ]
    },
    register: {
        stream: {
            username: {
                type: 'string',
                required: true
            },
            password: {
                type: 'string',
                required: true
            },
            avatar: {
                type: 'string',
                required: true
            },
            origin: {
                type: 'string',
                default: 'home'
            }
        },
        operations: [
            {
                order: 0,
                service: 'passwordEncoder',
                method: 'encode',
                arguments: ['@password@'],
                scope: 'encodedPassword'
            },
            {
                order: 1,
                service: 'gnuckiMongodb:db.main.collection.players',
                method: 'insertOne',
                arguments: [
                    {
                        username: '@username@',
                        password: '@encodedPassword@',
                        avatar: '@avatar@'
                    }
                ],
                scope: 'player'
            }
        ],
        children: [
            {
                order: 2,
                name: 'login',
                input: {
                    username: '@username@',
                    password: '@password@',
                    origin: '@origin@'
                }
            }
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