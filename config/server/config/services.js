'use strict';

/**
 * @see https://github.com/gnodi/danf/blob/master/resource/private/doc/documentation/core/dependency-injection.md
 */
module.exports = {
    dataContainer: {
        class: 'dataContainer',
        properties: {
            app: '#danf:app#',
            logger: '#danf:logging.logger#',
            loadSequence: '#danf:sequencing.sequencesContainer[load]#'
        }
    },
    passwordEncoder: {
        class: 'encoder',
        properties: {
            salt: '%encoding.salt%',
            iterations: '%encoding.iterations%',
            keylen: '%encoding.keylen%',
            digest: '%encoding.digest%'
        }
    },
    summonerRoleDeterminer: {
        class: 'summonerRoleDeterminer'
    }
};