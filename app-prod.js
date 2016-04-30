'use strict';

module.exports = {
    server: {
        configuration: 'auto',
        context: {
            environment: 'prod',
            debug: false,
            verbosity: 1,
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
        }
    },
    client: {
        configuration: 'auto',
        context: {
            environment: 'prod',
            debug: false,
            verbosity: 1,
            secret: 'c8f6ef14-13f1-4399-9020-8c39fa71db1a'
        }
    }
};