'use strict';

/**
 * @see https://github.com/gnodi/danf/blob/master/resource/private/doc/documentation/core/events.md
 */
module.exports = {
    playerUpdate: {
        data: {
            player: {
                type: 'object'
            }
        },
        sequences: [
            {
                name: 'updatePlayer',
                input: {
                    player: '@player@'
                }
            }
        ]
    }
};