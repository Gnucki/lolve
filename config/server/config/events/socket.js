'use strict';

/**
 * @see https://github.com/gnodi/danf/blob/master/resource/private/doc/documentation/core/events.md
 */
module.exports = {
    fightLoading: {
        data: {
            username: {
                type: 'string',
                default: ''
            }
        },
        sequences: [
            {
                name: 'loadFight',
                input: {
                    username: '@username@'
                }
            }
        ]
    }
};