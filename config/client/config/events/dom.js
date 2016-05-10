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
            },
            {
                name: 'synchronize'
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