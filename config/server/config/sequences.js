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
    /*
     *
     * Fight.
     *
     */
    checkFighting: {
        operations: [
            {
                order: 0,
                service: 'gnuckiMongodb:db.main.collection.fights',
                method: 'findOne',
                arguments: [
                    {
                        player1: '!request.session.player.username!'
                    }
                ],
                scope: 'fight'
            },
            {
                order: 1,
                condition: function(stream) {
                    return null == stream.fight;
                },
                service: 'gnuckiMongodb:db.main.collection.fights',
                method: 'findOne',
                arguments: [
                    {
                        player2: '!request.session.player.username!'
                    }
                ],
                scope: 'fight'
            },
            {
                order: 2,
                condition: function(stream) {
                    return null == stream.fight;
                },
                service: 'gnuckiMongodb:db.main.collection.waiters',
                method: 'findOne',
                arguments: [
                    {
                        player: '!request.session.player.username!'
                    }
                ],
                scope: 'fight'
            },
            {
                order: 10,
                service: 'danf:manipulation.callbackExecutor',
                method: 'execute',
                arguments: [
                    function(fight) {
                        return null != fight;
                    },
                    '@fight@'
                ],
                scope: 'fighting'
            }
        ]
    },
    wait: {
        stream: {
            for: {
                type: 'string'
            },
            mode: {
                type: 'string',
                required: true
            }
        },
        operations: [
            {
                order: -10,
                condition: function(stream, context) {
                    return null == context.request.session.player;
                },
                service: 'danf:http.redirector',
                method: 'redirect',
                arguments: ['/']
            },
            {
                order: -8,
                condition: function(stream, context) {
                    return stream.fighting;
                },
                service: 'danf:http.redirector',
                method: 'redirect',
                arguments: ['/fight']
            },
            {
                order: 2,
                service: 'danf:http.redirector',
                method: 'redirect',
                arguments: ['/fight']
            }
        ],
        children: [
            {
                order: -9,
                name: 'checkFighting',
                output: {
                    fighting: '@fighting@'
                }
            },
            {
                order: 1,
                condition: function(stream) {
                    return 'training' === stream.mode;
                },
                name: 'waitTraining'
            },
            {
                order: 1,
                condition: function(stream) {
                    return 'competition' === stream.mode;
                },
                name: 'waitCompetition',
                input: {
                    for: '@for@'
                }
            },
            {
                order: 1,
                condition: function(stream) {
                    return 'challenge' === stream.mode;
                },
                name: 'waitChallenge'
            }
        ]
    },
    waitTraining: {
        operations: [
            {
                order: 0,
                service: 'gnuckiMongodb:db.main.collection.fights',
                method: 'insertOne',
                arguments: [
                    {
                        player1: '!request.session.player.username!',
                        player2: 'A.I.',
                        competitive: false
                    }
                ]
            }
        ]
    },
    waitCompetition: {
        operations: [
            {
                order: 0,
                service: 'gnuckiMongodb:db.main.collection.waiters',
                method: 'insertOne',
                arguments: [
                    {
                        player: '!request.session.player.username!'
                    }
                ]
            }
        ]
    },
    waitChallenge: {
        operations: [
            {
                order: 0,
                service: 'gnuckiMongodb:db.main.collection.players',
                method: 'findOne',
                arguments: [
                    {
                        username: '@for@'
                    }
                ],
                scope: 'player'
            },
            {
                order: 1,
                condition: function(stream) {
                    return null == stream.player;
                },
                service: 'danf:http.sessionHandler',
                method: 'set',
                arguments: [
                    'registerError',
                    'No player "@username@" found'
                ]
            },
            {
                order: 2,
                condition: function(stream) {
                    return null == stream.player;
                },
                service: 'danf:http.redirector',
                method: 'redirect',
                arguments: ['!request.url!']
            },
            {
                order: 10,
                service: 'gnuckiMongodb:db.main.collection.waiters',
                method: 'insertOne',
                arguments: [
                    {
                        player: '!request.session.player.username!',
                        for: '@for@'
                    }
                ]
            }
        ]
    },
    match: {
        operations: [
            {
                order: 0,
                service: 'dataContainer',
                method: 'getWaiters',
                scope: 'waiters'
            },
            {
                order: 1,
                service: 'matcher',
                method: 'match',
                arguments: [
                    '@waiters@'
                ]
            }
        ]
    },
    fight: {
        operations: [
            {
                order: 0,
                service: 'dataContainer',
                method: 'getFights',
                scope: 'fights'
            },
            {
                order: 1,
                service: 'fightProcessor',
                method: 'fight',
                arguments: [
                    '@fights@'
                ]
            }
        ]
    },
    /*
     *
     * Connection.
     *
     */
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
                service: 'danf:manipulation.callbackExecutor',
                method: 'execute',
                arguments: [
                    function(origin) {
                        return origin.replace(/^main:/, '');
                    },
                    '@originRoute.name@'
                ],
                scope: 'origin'
            },
            {
                order: 2,
                service: 'danf:manipulation.proxyExecutor',
                method: 'execute',
                arguments: [
                    '@loginRoute@',
                    'resolve',
                    {
                        origin: '@origin@'
                    }
                ],
                scope: 'loginUrl'
            },
            {
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
                service: 'danf:tcp.messenger',
                method: 'emit',
                arguments: [
                    '[-]playerUpdate',
                    {
                        player: '@player@'
                    },
                    '-'
                ]
            },
            {
                order: 10,
                service: 'danf:http.router',
                method: 'get',
                arguments: ['[-]@origin@'],
                scope: 'originRoute'
            },
            {
                order: 11,
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
                order: 12,
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
                service: 'danf:tcp.messenger',
                method: 'emit',
                arguments: [
                    '[-]playerUpdate',
                    {
                        player: null
                    },
                    '-'
                ]
            },
            {
                order: 4,
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
                order: 1,
                condition: function(stream) {
                    return null != stream.player;
                },
                service: 'danf:http.sessionHandler',
                method: 'set',
                arguments: [
                    'registerError',
                    'Player "@username@" already exists'
                ]
            },
            {
                order: 2,
                condition: function(stream) {
                    return null != stream.player;
                },
                service: 'danf:http.redirector',
                method: 'redirect',
                arguments: ['!request.url!']
            },
            {
                order: 10,
                service: 'passwordEncoder',
                method: 'encode',
                arguments: ['@password@'],
                scope: 'encodedPassword'
            },
            {
                order: 11,
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
    updatePlayer: {
        operations: [
            {
                order: 0,
                service: 'danf:http.sessionHandler',
                method: 'get',
                arguments: ['player'],
                scope: 'player'
            },
            {
                order: 1,
                service: 'danf:tcp.messenger',
                method: 'emit',
                arguments: [
                    '[-]playerUpdate',
                    {
                        player: '@player@'
                    },
                    '-'
                ]
            }
        ]
    },
    /*
     *
     * Data loading.
     *
     */
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
    },
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
    }
};