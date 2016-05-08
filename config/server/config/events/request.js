'use strict';

/**
 * @see https://github.com/gnodi/danf/blob/master/resource/private/doc/documentation/core/events.md
 */
module.exports = {
    home: {
        view: {
            html: {
                layout: {
                    file: '%view.path%/layout.jade'
                },
                body: {
                    file: '%view.path%/index.jade'
                }
            }
        },
        sequences: [
            {
                name: 'updatePlayer'
            }
        ]
    },
    login: {
        parameters: {
            origin: {
                type: 'string',
                default: 'home'
            }
        },
        view: {
            html: {
                layout: {
                    file: '%view.path%/layout.jade'
                },
                body: {
                    file: '%view.path%/login.jade'
                }
            }
        },
        sequences: [
            {
                name: 'getLoginErrors',
                output: {
                    errors: '@errors@'
                }
            }
        ]
    },
    connect: {
        parameters: {
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
                default: 'Trundle'
            },
            origin: {
                type: 'string',
                default: 'home'
            },
            mode: {
                type: 'string',
                required: true
            }
        },
        view: {
            html: {
                layout: {
                    file: '%view.path%/layout.jade'
                },
                body: {
                    file: '%view.path%/login.jade'
                }
            }
        },
        sequences: [
            {
                condition: function(stream) {
                    return 'login' === stream.mode;
                },
                name: 'login',
                input: {
                    username: '@username@',
                    password: '@password@',
                    origin: '@origin@'
                }
            },
            {
                condition: function(stream) {
                    return 'registering' === stream.mode;
                },
                name: 'register',
                input: {
                    username: '@username@',
                    password: '@password@',
                    origin: '@origin@',
                    avatar: '@avatar@'
                }
            }
        ]
    },
    logout: {
        sequences: [
            {
                name: 'logout'
            }
        ]
    },
    player: {
        sequences: [
            {
                name: 'updatePlayer'
            }
        ]
    },
    training: {
        view: {
            html: {
                layout: {
                    file: '%view.path%/layout.jade'
                },
                body: {
                    file: '%view.path%/training.jade'
                }
            }
        },
        sequences: [
            {
                order: 0,
                name: 'checkLogin'
            },
            {
                order: 1,
                name: 'checkFighting',
                output: {
                    fighting: '@fighting@'
                }
            }
        ]
    },
    competition: {
        view: {
            html: {
                layout: {
                    file: '%view.path%/layout.jade'
                },
                body: {
                    file: '%view.path%/competition.jade'
                }
            }
        },
        sequences: [
            {
                order: 0,
                name: 'checkLogin'
            },
            {
                order: 1,
                name: 'checkFighting',
                output: {
                    fighting: '@fighting@'
                }
            }
        ]
    },
    challenge: {
        view: {
            html: {
                layout: {
                    file: '%view.path%/layout.jade'
                },
                body: {
                    file: '%view.path%/challenge.jade'
                }
            }
        },
        sequences: [
            {
                order: 0,
                name: 'checkLogin'
            },
            {
                order: 1,
                name: 'checkFighting',
                output: {
                    fighting: '@fighting@'
                }
            }
        ]
    },
    waiting: {
        parameters: {
            for: {
                type: 'string',
                default: null
            },
            mode: {
                type: 'string',
                required: true
            }
        },
        sequences: [
            {
                order: 0,
                name: 'wait',
                input: {
                    for: '@for@',
                    mode: '@mode@'
                }
            }
        ]
    },
    fight: {
        view: {
            html: {
                layout: {
                    file: '%view.path%/layout.jade'
                },
                body: {
                    file: '%view.path%/fight.jade'
                }
            }
        },
        sequences: [
            {
                order: 0,
                name: 'checkLogin'
            }
        ]
    },
    champions: {
        view: {
            html: {
                layout: {
                    file: '%view.path%/layout.jade'
                },
                body: {
                    file: '%view.path%/champions.jade'
                }
            }
        },
        sequences: [
            {
                order: 0,
                name: 'loadChampions',
                output: {
                    champions: '@champions@'
                }
            }
        ]
    },
    lolApi: {
        host: '%lol.api.host%',
        parameters: {
            api_key: '%lol.api.key%'
        }
    }
};