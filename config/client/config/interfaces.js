'use strict';

/**
 * @see https://github.com/gnodi/danf/blob/master/resource/private/doc/documentation/core/oop.md
 */
module.exports = {
    fightProcessor: {
        methods: {
            check: {
                returns: 'boolean'
            },
            process: {
                arguments: ['object/fight']
            }
        }
    },
    playerFrame: {
        methods: {
            getUsername: {
                returns: 'string'
            },
            update: {
                arguments: ['object|null/player']
            }
        }
    },
    selector: {
        methods: {
            selectAvatar: {
                arguments: ['object|string/image']
            }
        }
    },
    synchronizer: {
        methods: {
            computeDiff: {},
            synchronize: {
                arguments: ['number/time'],
                returns: 'number'
            }
        }
    }
};