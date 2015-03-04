describe('localq', function() {
  it('should be a function', function() {
    expect(typeof localq).toBe('function');
  });
});

describe('queue', function() {
  var queue = localq({});
  
  it('should return an object', function() {
    expect(typeof queue).toBe('object');
  });

  it('should expose methods', function() {
    expect(typeof queue.push).toBe('function');
    expect(typeof queue.flush).toBe('function');
    expect(typeof queue.start).toBe('function');
    expect(typeof queue.pause).toBe('function');
  });

  it('should expose properties', function() {
    expect(typeof queue._expire).toBe('object');
    expect(typeof queue._timeout).toBe('number');
    expect(typeof queue._retry).toBe('number');

    expect(typeof queue._interval).toBe('number');
    expect(typeof queue._size).toBe('number');
    expect(typeof queue._name).toBe('string');

    expect(typeof queue._debug).toBe('boolean');
    expect(typeof queue.worker).toBe('function');
  });
});
