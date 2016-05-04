'use strict';

/**
 * @see https://github.com/gnodi/danf/blob/master/resource/private/doc/documentation/core/sequencing.md
 */
module.exports = {
    initializeAvatar: {
        operations: [
            {
                service: 'selector',
                method: 'selectAvatar',
                arguments: ['http://ddragon.leagueoflegends.com/cdn/6.8.1/img/champion/Trundle.png']
            }
        ]
    },
    selectAvatar: {
        operations: [
            {
                service: 'selector',
                method: 'selectAvatar',
                arguments: ['!event.target!']
            }
        ]
    },
    updatePlayer: {
        operations: [
            {
                service: 'playerFrame',
                method: 'update',
                arguments: ['@player@']
            }
        ]
    }
};