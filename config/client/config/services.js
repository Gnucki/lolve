'use strict';

/**
 * @see https://github.com/gnodi/danf/blob/master/resource/private/doc/documentation/core/dependency-injection.md
 */
module.exports = {
    playerFrame: {
        class: 'playerFrame',
        properties: {
            jquery: '#danf:vendor.jquery#'
        }
    },
    selector: {
        class: 'selector',
        properties: {
            jquery: '#danf:vendor.jquery#'
        }
    }
};