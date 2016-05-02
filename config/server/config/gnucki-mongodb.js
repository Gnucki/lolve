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
                        }
                    }
                },
                games: {
                    document: {
                    }
                }
            }
        }
    }
};