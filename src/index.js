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
function Queue (opts) {
  var self = this;

  // Parse options
  self._expire = opts.expire || null;
  self._timeout = opts.timeout || 5000;
  self._retry = opts.retry || 10;

  self._interval = opts.interval || 1000;
  self._size = opts.size || 4980736;
  self._name = opts.name || 'localq';
  
  self._debug = opts.debug || false;
  self._poll = null;

  // Storage
  self._storage = new Storage(self._name, self._size);
  self._storage.push({}, function (err) {
    // console.dir(err);
  });

  // @todo Watch for task expiration
  // @todo Watch for overflow (size)

  // Default worker
  self.worker = function(job, callback) {
    callback('Worker not specified');
  };

  // Logger
  self.log = function(msg) {
    if (self._debug) console.log('[localq] ' + msg);
  };

  // Start polling
  self.start();

  // if (self._debug) console.dir(self);
}

/**
 * Inherit from event emitter
 */
inherits(Queue, emitter);

Queue.prototype.push = function(job, retry, callback) {
  var self = this;

  // Parse arguments
  if (typeof retry === 'undefined') retry = self._retry;
  if (typeof retry === 'function') {
    callback = retry;
    retry = self._retry;
  }

  // Append metadata and push to storage
  self._storage.push({
    payload: job,
    retry: retry,
    stamp: Math.floor(Date.now() / 1000)
  }, callback);
};

Queue.prototype.flush = function(callback) {
  var self = this;
  self._storage.flush(callback);
};

Queue.prototype.pause = function() {
  var self = this;
  clearInterval(self._poll);
};

Queue.prototype.start = function() {
  var self = this;

  // Define a single unit of work
  var tick = function () {
    self._storage.pull(function (err, job) {
      if (err) self.log(err);
      if (typeof job === 'undefined') return;

      self.log('Processing job');
      self.worker(job, function (err) {
        if (!err) return;
        
        // Handle the error and return job to the queue
        self.log(err);
        if (job.retry > 0) {
          job.retry--;
          job.stamp = Math.floor(Date.now() / 1000);
          self._storage.push(job);
        }
      });
    });
  };

  // Start interval timer
  self._poll = setInterval(tick, self._interval);
};

/**
 * Export
 */
module.exports = function(opts) {
  return new Queue(opts);
};
