var queue = localq({});

describe('push string', function() {
  it('with retry and callback should not return an error', function() {
    queue.push('foo', 0, function(err) {
      expect(err).toBe(null);
    });
  });
});

describe('push object', function() {
  it('with retry and callback should not return an error', function() {
    queue.push({
      foo: 'bar',
      bar: [ 'baz' ]
    }, 0, function(err) {
      expect(err).toBe(null);
    });
  });
});
