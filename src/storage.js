var localforage = require('localforage');

/**
 * Constructor
 */
function Storage(name, size) {
  var _this = this;

  // IndexedDB configuration
  localforage.config({
    name: name,
    size: size
  });

  // Init queue if it does not exist or is corrupted
  localforage.getItem('q', function(err, obj) {
    if (err || obj === null) _this.flush();
    if (typeof obj !== 'object') _this.flush();
    if (!Array.isArray(obj)) _this.flush();
  });
}

Storage.prototype.push = function(obj, callback) {
  localforage.getItem('q', function(err, q) {
    if (err) return callback('Could not access DB');

    // Add item to end of the array
    q.push(obj);

    // Persist
    localforage.setItem('q', q, callback);
  });
};

Storage.prototype.pull = function(callback) {
  localforage.getItem('q', function(err, q) {
    if (err) return callback('Could not access DB');

    // Remove first item from the array
    var task = q.shift();

    // Persist
    localforage.setItem('q', q, function(err) {
      if (err) return callback('Could not update the DB');
      callback(null, task);
    });
  });
};

Storage.prototype.flush = function(callback) {
  localforage.setItem('q', [], callback);
};

Storage.prototype.audit = function(callback) {
  localforage.getItem('q', callback);
};

module.exports = Storage;
