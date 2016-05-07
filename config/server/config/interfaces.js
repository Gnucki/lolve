'use strict';

/**
 * @see https://github.com/gnodi/danf/blob/master/resource/private/doc/documentation/core/oop.md
 */
module.exports = {
    dataContainer: {
        methods: {
            load: {},
            getSummoners: {},
            getChampions: {
                arguments: ['boolean/indexed'],
                returns: 'object|array'
            },
            getWaiters: {},
            getFights: {}
        }
    },
    encoder: {
        methods: {
            encode: {
                arguments: ['string/data']
            }
        }
    },
    matcher: {
        methods: {
            process: {},
            match: {
                arguments: ['object/waiters']
            }
        }
    },
    fightProcessor: {
        methods: {
            process: {},
            fight: {
                arguments: ['object/fights']
            },
            render:  {
                arguments: ['object/fight']
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