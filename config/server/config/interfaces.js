'use strict';

/**
 * @see https://github.com/gnodi/danf/blob/master/resource/private/doc/documentation/core/oop.md
 */
module.exports = {
    dataContainer: {
        methods: {
            load: {}
        }
    },
    encoder: {
        methods: {
            encode: {
                arguments: ['string/data']
            }
        }
    },
    summonerRoleDeterminer: {
        methods: {
            determine: {
                arguments: [
                    'object/summoner',
                    'object/games'
                ]
            }
        }
    }
};