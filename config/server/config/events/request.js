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
        sequences: []
    },
    login: {
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
        sequences: []
    },
    connect: {
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
                    password: '@password@'
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
                    avatar: '@avatar@'
                }
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