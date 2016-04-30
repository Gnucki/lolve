'use strict';

module.exports = {
    server: {
        configuration: 'auto',
        context: {
            cluster: [
                {
                    listen: ['http', 'socket'],
                    port: 3080,
                    workers: 1
                },
                {
                    listen: 'command',
                    port: 3111,
                    workers: 1
                }
            ]
        }
    },
    client: {
        configuration: 'auto',
        context: {}
    }
};