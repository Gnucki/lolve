'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    fs = require('fs')
;

/**
 * @see https://github.com/gnodi/danf/blob/master/resource/private/doc/documentation/core/configuration.md
 */
module.exports = {
    lol: {
        api: {
            protocol: 'https',
            host: 'global.api.pvp.net:443',
            chunks: {
                game: {
                    version: 'v1.3'
                },
                league: {
                    version: 'v2.5'
                },
                staticData: {
                    version: 'v1.2'
                }
            }
        }
    },
    view: {
        path: fs.realpathSync(
            path.join(__dirname, '../../../resource/private/view')
        )
    }
};
