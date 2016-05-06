'use strict';

module.exports = {
    connections: {
        main: {
            url: 'mongodb://%databases.main.host%:%databases.main.port%/lolve',
            collections: {
                players: {
                    document: {
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
                        }
                    }
                },
                waiters: {
                    document: {
                        player: {
                            type: 'string',
                            required: true
                        },
                        waiting: {
                            type: 'string'
                        }
                    }
                },
                fights: {
                    document: {
                        player1: {
                            type: 'string',
                            required: true
                        },
                        player2: {
                            type: 'string',
                            required: true
                        },
                        competitive: {
                            type: 'boolean',
                            required: true
                        }
                    }
                },
                competitions: {
                    document: {
                        player1: {
                            type: 'string',
                            required: true
                        },
                        player2: {
                            type: 'string',
                            required: true
                        }
                    }
                },
                summoners: {
                    document: {}
                }
            }
        }
    }
};