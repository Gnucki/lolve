'use strict';

/**
 * Expose `Encoder`.
 */
module.exports = Encoder;

/**
 * Module dependencies.
 */
var crypto = require('crypto');

/**
 * Initialize a new data container.
 */
function Encoder() {
}

Encoder.defineImplementedInterfaces(['encoder']);

Encoder.defineDependency('_salt', 'string');
Encoder.defineDependency('_iterations', 'number');
Encoder.defineDependency('_keylen', 'number');
Encoder.defineDependency('_digest', 'string');

/**
 * Salt.
 *
 * @var {string}
 * @api public
 */
Object.defineProperty(Encoder.prototype, 'salt', {
    set: function(salt) { this._salt = salt; }
});

/**
 * Iterations.
 *
 * @var {number}
 * @api public
 */
Object.defineProperty(Encoder.prototype, 'iterations', {
    set: function(iterations) { this._iterations = iterations; }
});

/**
 * Keylen.
 *
 * @var {number}
 * @api public
 */
Object.defineProperty(Encoder.prototype, 'keylen', {
    set: function(keylen) { this._keylen = keylen; }
});

/**
 * Disgest.
 *
 * @var {string}
 * @api public
 */
Object.defineProperty(Encoder.prototype, 'digest', {
    set: function(digest) { this._digest = digest; }
});

/**
 * @interface {dataContainer}
 */
Encoder.prototype.encode = function(data) {
    var key = crypto.pbkdf2Sync(
        data,
        this._salt,
        this._iterations,
        this._keylen,
        this._digest
    );

    return key.toString('hex');
}