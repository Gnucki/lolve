'use strict';

/**
 * @see https://github.com/gnodi/danf/blob/master/resource/private/doc/documentation/core/events.md
 */
module.exports = {
    ready: {
        event: 'ready',
        sequences: [
            {
                name: 'initializeAvatar'
            },
            {
                name: 'initializeFight'
            }
        ]
    },
    championImageClick: {
        event: 'click',
        selector: 'img.champion',
        sequences: [
            {
                name: 'selectAvatar'
            }
        ]
    }
};