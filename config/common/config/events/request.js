'use strict';

/**
 * @see https://github.com/gnodi/danf/blob/master/resource/private/doc/documentation/core/events.md
 */
module.exports = {
    home: {
        path: '/',
        methods: ['GET']
    },
    login: {
        path: '/login',
        methods: ['GET'],
        parameters: {
            origin: {
                type: 'string'
            }
        }
    },
    logout: {
        path: '/logout',
        methods: ['GET']
    },
    player: {
        path: '/player',
        methods: ['GET']
    },
    connect: {
        path: '/login',
        methods: ['POST']
    },
    training: {
        path: '/training',
        methods: ['GET']
    },
    fight: {
        path: '/fight',
        methods: ['GET']
    },
    challenge: {
        path: '/challenge',
        methods: ['GET']
    },
    champions: {
        path: '/champions',
        methods: ['GET']
    }
};