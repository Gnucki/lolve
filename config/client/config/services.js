'use strict';

/**
 * @see https://github.com/gnodi/danf/blob/master/resource/private/doc/documentation/core/dependency-injection.md
 */
module.exports = {
    fightProcessor: {
        class: 'fightProcessor',
        properties: {
            jquery: '#danf:vendor.jquery#',
            messenger: '#danf:tcp.messenger#',
            synchronizer: '#synchronizer#'
        }
    },
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
    },
    synchronizer: {
        class: 'synchronizer',
        properties: {
            jquery: '#danf:vendor.jquery#'
        }
    }
};