'use strict';

/**
 * @see https://github.com/gnodi/danf/blob/master/resource/private/doc/documentation/core/events.md
 */
module.exports = {
    home: {
        path: '/',
        methods: ['get'],
        view: {
            html: {
                layout: {
                    file: '%view.path%/layout.jade'
                },
                body: {
                    file: '%view.path%/index.jade'
                }
            }
        },
        children: {
            test: {
            }
        },
        sequences: [
            {
                name: 'loadHome',
                output: {
                    responses: '@responses@'
                }
            }
        ]
    },
    lolApi: {
        host: '%lol.api.host%',
        parameters: {
            api_key: '%lol.api.key%'
        }
    }
};