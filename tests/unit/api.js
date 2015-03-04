describe('localq', function() {
  it('should be a function', function() {
    assert.equal(typeof localq, 'function');
  });
});

describe('queue', function() {
  var queue = localq({});
  
  it('should return an object', function() {
    assert.equal(typeof queue, 'object');
  });

  it('should expose methods', function() {
    assert.equal(typeof queue.push, 'function');
    assert.equal(typeof queue.flush, 'function');
    assert.equal(typeof queue.start, 'function');
    assert.equal(typeof queue.pause, 'function');
  });

  it('should expose properties', function() {
    assert.equal(typeof queue._expire, 'object');
    assert.equal(typeof queue._timeout, 'number');
    assert.equal(typeof queue._retry, 'number');

    assert.equal(typeof queue._interval, 'number');
    assert.equal(typeof queue._size, 'number');
    assert.equal(typeof queue._name, 'string');

    assert.equal(typeof queue._debug, 'boolean');
    assert.equal(typeof queue.worker, 'function');
  });
});
