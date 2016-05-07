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
    },
    summonerChoice: {
        data: {
            number: {
                type: 'number',
                required: true
            }
        },
        sequences: [
            {
                name: 'chooseSummoner',
                condition: function(stream, context) {
                    console.log('----', context.request.session);
                    return null != context.request.session.player;
                },
                input: {
                    number: '@number@'
                }
            }
        ]
    }
};