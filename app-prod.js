'use strict';

module.exports = {
    server: {
        configuration: 'auto',
        context: {
            environment: 'prod',
            debug: false,
            verbosity: 1
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