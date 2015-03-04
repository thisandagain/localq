/**
 * A persistent job queue for browsers.
 *
 * @package localq
 * @author  Adam Lofting <adam@mozillafoundation.org>
 *          Andrew Sliwinski <a@mozillafoundation.org>
 */

var inherits = require('util').inherits;
var emitter = require('events').EventEmitter;

var Storage = require('./storage');

/**
 * Constructor
 */
function Queue(opts) {
  var _this = this;

  // Parse options
  _this._expire = opts.expire || null;
  _this._timeout = opts.timeout || 5000;
  _this._retry = opts.retry || 10;

  _this._interval = opts.interval || 1000;
  _this._size = opts.size || 4980736;
  _this._name = opts.name || 'localq';

  _this._debug = opts.debug || false;
  _this._poll = null;

  // Storage
  _this._storage = new Storage(_this._name, _this._size);
  _this._storage.push({}, function(err) {
    // console.dir(err);
  });

  // @todo Watch for task expiration
  // @todo Watch for overflow (size)

  // Default worker
  _this.worker = function(job, callback) {
    callback('Worker not specified');
  };

  // Logger
  _this.log = function(msg) {
    if (_this._debug) console.log('[localq] ' + msg);
  };

  // Start polling
  _this.start();

  // if (self._debug) console.dir(self);
}

/**
 * Inherit from event emitter
 */
inherits(Queue, emitter);

Queue.prototype.push = function(job, retry, callback) {
  var _this = this;

  // Parse arguments
  if (typeof retry === 'undefined') retry = _this._retry;
  if (typeof retry === 'function') {
    callback = retry;
    retry = _this._retry;
  }

  // Append metadata and push to storage
  _this._storage.push({
    payload: job,
    retry: retry,
    stamp: Math.floor(Date.now() / 1000)
  }, callback);
};

Queue.prototype.flush = function(callback) {
  var _this = this;
  _this._storage.flush(callback);
};

Queue.prototype.pause = function() {
  var _this = this;
  clearInterval(_this._poll);
};

Queue.prototype.start = function() {
  var _this = this;

  // Define a single unit of work
  var tick = function() {
    _this._storage.pull(function(err, job) {
      if (err) _this.log(err);
      if (typeof job === 'undefined') return;

      _this.log('Processing job');
      _this.worker(job, function(err) {
        if (!err) return;

        // Handle the error and return job to the queue
        _this.log(err);
        if (job.retry > 0) {
          job.retry--;
          job.stamp = Math.floor(Date.now() / 1000);
          _this._storage.push(job);
        }
      });
    });
  };

  // Start interval timer
  _this._poll = setInterval(tick, _this._interval);
};

/**
 * Export
 */
module.exports = function(opts) {
  return new Queue(opts);
};
