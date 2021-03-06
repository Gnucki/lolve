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
                arguments: ['http://ddragon.leagueoflegends.com/cdn/6.8.1/img/champion/Trundle.png']
            }
        ]
    },
    selectAvatar: {
        operations: [
            {
                service: 'selector',
                method: 'selectAvatar',
                arguments: ['!event.target!']
            }
        ]
    },
    updatePlayer: {
        operations: [
            {
                service: 'playerFrame',
                method: 'update',
                arguments: ['@player@']
            }
        ]
    },
    initializeFight: {
        operations: [
            {
                order: 0,
                service: 'fightProcessor',
                method: 'check',
                scope: 'fighting'
            },
            {
                order: 2,
                condition: function(stream) {
                    return stream.fighting;
                },
                service: 'danf:tcp.messenger',
                method: 'emit',
                arguments: [
                    '[-]fightLoading'
                ]
            }
        ]
    },
    processFight: {
        operations: [
            {
                service: 'fightProcessor',
                method: 'process',
                arguments: ['@fight@']
            }
        ]
    },
    synchronize: {
        operations: [
            {
                service: 'synchronizer',
                method: 'computeDiff'
            }
        ]
    }
};