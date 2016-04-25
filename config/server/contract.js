'use strict';

/**
 * @see https://github.com/gnodi/danf/blob/master/resource/private/doc/documentation/core/configuration.md
 */
module.exports = {
    lol: {
        type: 'embedded',
        default: {},
        embed: {
            api: {
                type: 'embedded',
                embed: {
                    protocol: {
                        type: 'string',
                        required: true
                    },
                    host: {
                        type: 'string',
                        required: true
                    },
                    key: {
                        type: 'string',
                        required: true
                    },
                    chunks: {
                        type: 'embedded_object',
                        default: {},
                        embed: {
                            version: {
                                type: 'string',
                                required: true
                            }
                        }
                    }
                }
            }
        }
    }
};