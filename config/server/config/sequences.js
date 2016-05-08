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
                type: 'string',
                default: ''
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
                name: 'waitCompetition'
            },
            {
                order: 1,
                condition: function(stream) {
                    return 'challenge' === stream.mode;
                },
                name: 'waitChallenge',
                input: {
                    for: '@for@'
                }
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
                ],
                scope: 'fights'
            },
            {
                order: 2,
                condition: function(stream) {
                    return 0 !== stream.fights.length;
                },
                service: 'gnuckiMongodb:db.main.collection.fights',
                method: 'insertMany',
                arguments: ['@fights@']
            }
        ],
        children: [
            {
                order: 10,
                name: 'startFight',
                input: {
                    fight: '@@.@@'
                },
                collection: {
                    input: '@fights@',
                    method: '||'
                }
            }
        ]
    },
    startFight: {
        stream: {
            fight: {
                type: 'object',
                required: true
            }
        },
        operations: [
            {
                order: 0,
                service: 'gnuckiMongodb:db.main.collection.waiters',
                method: 'deleteMany',
                arguments: [
                    {
                        player: '@fight.player1@'
                    }
                ]
            },
            {
                order: 0,
                service: 'gnuckiMongodb:db.main.collection.waiters',
                method: 'deleteMany',
                arguments: [
                    {
                        player: '@fight.player2@'
                    }
                ]
            }
        ],
        children: [
            {
                order: 0,
                name: 'notifyFightProcessing',
                input: {
                    fight: '@fight@'
                }
            }
        ]
    },
    notifyFightProcessing: {
        stream: {
            fight: {
                type: 'object',
                required: true
            }
        },
        operations: [
            {
                order: 0,
                service: 'gnuckiMongodb:db.main.collection.players',
                method: 'findOne',
                arguments: [
                    {
                        username: '@fight.player1@'
                    }
                ],
                scope: 'fight.player1'
            },
            {
                order: 0,
                service: 'gnuckiMongodb:db.main.collection.players',
                method: 'findOne',
                arguments: [
                    {
                        username: '@fight.player2@'
                    }
                ],
                scope: 'fight.player2'
            },
            {
                order: 1,
                service: 'fightProcessor',
                method: 'render',
                arguments: ['@fight@'],
                scope: 'fight.game'
            },
            {
                order: 10,
                service: 'danf:tcp.messenger',
                method: 'emit',
                arguments: [
                    '[-]fightProcessing',
                    {
                        fight: '@fight@'
                    },
                    ['@fight.player1.username@', '@fight.player2.username@']
                ]
            }
        ]
    },
    loadFight: {
        stream: {
            username: {
                type: 'string',
                default: ''
            }
        },
        operations: [
            {
                order: 0,
                service: 'danf:http.sessionHandler',
                method: 'get',
                arguments: [
                    'player'
                ],
                scope: 'player'
            },
            {
                order: 1,
                service: 'danf:manipulation.callbackExecutor',
                method: 'execute',
                arguments: [
                    function(player, username) {
                        return player
                            ? player.username
                            : username
                        ;
                    },
                    '@player@',
                    '@username@'
                ],
                scope: 'username'
            },
            {
                order: 2,
                service: 'gnuckiMongodb:db.main.collection.fights',
                method: 'findOne',
                arguments: [
                    {
                        $or: [
                            {player1: '@username@'},
                            {player2: '@username@'}
                        ]
                    }
                ],
                scope: 'fight'
            }
        ],
        children: [
            {
                order: -1,
                name: 'joinPlayerRoom'
            },
            {
                order: 10,
                condition: function(stream) {
                    return !!stream.fight;
                },
                name: 'notifyFightProcessing',
                input: {
                    fight: '@fight@'
                }
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
                ],
                scope: 'processedFights'
            },
            {
                order: 2,
                service: 'gnuckiMongodb:db.main.collection.fights',
                method: 'updateOne',
                arguments: [
                    {_id: '@@_id@@'},
                    '@@.@@'
                ],
                collection: {
                    input: '@processedFights@',
                    method: '||'
                }
            }
        ],
        children: [
            {
                order: 10,
                name: 'notifyFight',
                input: {
                    fight: '@@.@@'
                },
                collection: {
                    input: '@processedFights@',
                    method: '||'
                }
            },
            {
                order: 10,
                name: 'purgeFight',
                input: {
                    fight: '@@.@@'
                },
                collection: {
                    input: '@processedFights@',
                    method: '||'
                }
            }
        ]
    },
    notifyFight: {
        stream: {
            fight: {
                type: 'object',
                required: true
            }
        },
        children: [
            {
                order: 0,
                condition: function(stream) {
                    return !stream.fight.ended;
                },
                name: 'notifyFightProcessing',
                input: {
                    fight: '@fight@'
                }
            }
        ]
    },
    purgeFight: {
        stream: {
            fight: {
                type: 'object',
                required: true
            }
        },
        operations: [
            {
                order: 0,
                condition: function(stream) {
                    return stream.fight.ended && stream.fight.competitive && stream.fight.fight.player1.win;
                },
                service: 'gnuckiMongodb:db.main.collection.players',
                method: 'updateOne',
                arguments: [
                    {username: '@fight.player1@'},
                    {'$inc': {wins: 1}}
                ],
                scope: 'player'
            },
            {
                order: 0,
                condition: function(stream) {
                    return stream.fight.ended && stream.fight.competitive && !stream.fight.fight.player1.win;
                },
                service: 'gnuckiMongodb:db.main.collection.players',
                method: 'updateOne',
                arguments: [
                    {username: '@fight.player1@'},
                    {'$inc': {defeats: 1}}
                ],
                scope: 'player'
            },
            {
                order: 0,
                condition: function(stream) {
                    return stream.fight.ended && stream.fight.competitive && stream.fight.fight.player2.win;
                },
                service: 'gnuckiMongodb:db.main.collection.players',
                method: 'updateOne',
                arguments: [
                    {username: '@fight.player2@'},
                    {'$inc': {wins: 1}}
                ],
                scope: 'player'
            },
            {
                order: 0,
                condition: function(stream) {
                    return stream.fight.ended && stream.fight.competitive && !stream.fight.fight.player2.win;
                },
                service: 'gnuckiMongodb:db.main.collection.players',
                method: 'updateOne',
                arguments: [
                    {username: '@fight.player2@'},
                    {'$inc': {defeats: 1}}
                ],
                scope: 'player'
            },
            {
                order: 10,
                condition: function(stream) {
                    return stream.fight.ended && stream.fight.competitive;
                },
                service: 'gnuckiMongodb:db.main.collection.competitions',
                method: 'insertOne',
                arguments: [
                    '@fight@'
                ]
            },
            {
                order: 10,
                condition: function(stream) {
                    return stream.fight.ended;
                },
                service: 'gnuckiMongodb:db.main.collection.fights',
                method: 'deleteOne',
                arguments: [
                    {_id: '@fight._id@'},
                    '@fight@'
                ]
            }
        ]
    },
    chooseSummoner: {
        stream: {
            number: {
                type: 'number',
                required: true
            },
            role: {
                type: 'string',
                required: true
            }
        },
        operations: [
            {
                order: 1,
                service: 'fightProcessor',
                method: 'chooseSummoner',
                arguments: [
                    '@number@',
                    '@role@',
                    '@fight@',
                    '!request.session.player!'
                ],
                scope: 'fight'
            },
            {
                order: 2,
                condition: function(stream) {
                    return !!stream.fight;
                },
                service: 'gnuckiMongodb:db.main.collection.fights',
                method: 'updateOne',
                arguments: [
                    {_id: '@fight._id@'},
                    '@fight@'
                ]
            }
        ],
        children: [
            {
                order: 0,
                name: 'loadFight',
                input: {
                    username: ''
                },
                output: {
                    fight: '@fight@'
                }
            },
            {
                order: 10,
                name: 'loadFight',
                input: {
                    username: ''
                },
                output: {
                    fight: '@fight@'
                }
            },
            {
                order: 11,
                name: 'notifyFightProcessing',
                input: {
                    fight: '@fight@'
                }
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
                name: 'joinPlayerRoom'
            },
            {
                order: 1,
                condition: function(stream, context) {
                    return null == context.request.session.player;
                },
                name: 'redirectLogin'
            }
        ]
    },
    joinPlayerRoom: {
        operations: [
            {
                order: 0,
                condition: function(stream, context) {
                    return null != context.request.session.player;
                },
                service: 'danf:tcp.messenger',
                method: 'joinRoom',
                arguments: [
                    '!request.session.player.username!'
                ]
            }
        ]
    },
    redirectLogin: {
        stream: {
            origin: {
                type: 'string'
            }
        },
        operations: [
            {
                order: 0,
                condition: function(stream) {
                    return null == stream.origin;
                },
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
                condition: function(stream) {
                    return null == stream.origin;
                },
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
                order: -1,
                service: 'danf:http.sessionHandler',
                method: 'set',
                arguments: [
                    'registerError',
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
                service: 'danf:http.sessionHandler',
                method: 'save'
            },
            {
                order: 10,
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
                order: 12,
                service: 'danf:http.sessionHandler',
                method: 'set',
                arguments: [
                    'player',
                    '@player@'
                ]
            },
            {
                order: 13,
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
                order: 14,
                service: 'danf:tcp.messenger',
                method: 'joinRoom',
                arguments: [
                    '@player.username@'
                ]
            },
            {
                order: 20,
                service: 'danf:http.router',
                method: 'get',
                arguments: ['[-]@origin@'],
                scope: 'originRoute'
            },
            {
                order: 21,
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
                order: 22,
                service: 'danf:http.redirector',
                method: 'redirect',
                arguments: ['@originUrl@']
            }
        ],
        children: [
            {
                order: 4,
                condition: function(stream) {
                    return null == stream.player;
                },
                name: 'redirectLogin',
                input: {
                    origin: '@origin@'
                }
            },
            {
                order: 11,
                condition: function(stream) {
                    return stream.player.password !== stream.password;
                },
                name: 'redirectLogin',
                input: {
                    origin: '@origin@'
                }
            }
        ]
    },
    getLoginErrors: {
        operations: [
            {
                service: 'danf:manipulation.callbackExecutor',
                method: 'execute',
                arguments: [
                    function(context) {
                        var errors = {};

                        if (
                            context.request &&
                            context.request.session
                        ) {
                            if (context.request.session.loginError) {
                                errors.login = context.request.session.loginError;
                            }

                            if (context.request.session.registerError) {
                                errors.register = context.request.session.registerError;
                            }
                        }

                        return errors;
                    },
                    '!.!'
                ],
                scope: 'errors'
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
                order: -1,
                service: 'danf:http.sessionHandler',
                method: 'set',
                arguments: [
                    'loginError',
                    null
                ]
            },
            {
                order: -1,
                service: 'danf:http.sessionHandler',
                method: 'set',
                arguments: [
                    'registerError',
                    null
                ]
            },
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
                condition: function(stream) {
                    return null != stream.player;
                },
                name: 'redirectLogin',
                input: {
                    origin: '@origin@'
                }
            },
            {
                order: 20,
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
                condition: function (stream) {
                    return !!stream.player;
                },
                service: 'gnuckiMongodb:db.main.collection.players',
                method: 'findOne',
                arguments: [
                    {
                        username: '@player.username@'
                    }
                ],
                scope: 'player'
            },
            {
                order: 2,
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
                service: 'dataContainer',
                method: 'getSummoners',
                scope: 'summoners'
            }
        ],
        children: [
            {
                order: 1,
                condition: function(stream) {
                    return 0 === stream.summoners.length;
                },
                name: 'loadSummoners',
                output: {
                    summoners: '@summoners@'
                }
            },
            {
                order: 1,
                name: 'loadChampions',
                output: {
                    champions: '@champions.data@'
                }
            }
        ]
    },
    loadSummoners: {
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
                scope: 'routes.game'
            },
            {
                order: 2,
                service: 'danf:http.router',
                method: 'get',
                arguments: [
                    '[-]lolApi.summoner.summoner'
                ],
                scope: 'routes.summoner'
            },
            {
                order: 2,
                service: 'danf:http.router',
                method: 'get',
                arguments: [
                    '[-]lolApi.championmastery.topchampions'
                ],
                scope: 'routes.championmastery'
            },
            {
                order: 20,
                service: 'gnuckiMongodb:db.main.collection.summoners',
                method: 'insertMany',
                arguments: ['@summoners@']
            }
        ],
        children: [
            {
                order: 10,
                name: 'loadSummoner',
                input: {
                    routes: '@routes@',
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
                    '@routes.game@',
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
                order: 0,
                service: 'danf:manipulation.proxyExecutor',
                method: 'execute',
                arguments: [
                    '@routes.summoner@',
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
                scope: 'info'
            },
            {
                order: 0,
                service: 'danf:manipulation.proxyExecutor',
                method: 'execute',
                arguments: [
                    '@routes.championmastery@',
                    'follow',
                    {
                        api_key: '%lol.api.key%',
                        platform: 'euw1',
                        player: '@summoner.playerOrTeamId@',
                        count: 20
                    },
                    {},
                    {
                        protocol: '%lol.api.protocol%'
                    }
                ],
                scope: 'championmastery'
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
            },
            {
                order: 3,
                service: 'danf:manipulation.callbackExecutor',
                method: 'execute',
                arguments: [
                    function(summoner, info, championmastery) {
                        info = JSON.parse(info);
                        info = info[summoner.playerOrTeamId];

                        for (var key in info) {
                            summoner[key] = info[key];
                        }

                        summoner.championmastery = JSON.parse(championmastery);

                        return summoner;
                    },
                    '@summoner@',
                    '@info@',
                    '@championmastery@'
                ],
                scope: 'summoner'
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