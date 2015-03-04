var queue = localq({
  interval: 100,
  retry: 10
});

var attempts = 0;
queue.worker = function (job, callback) {
  attempts++;
  callback('Force retry.');
};

describe('retry', function() {
  it('should retry the job 3 times', function(done) {
    queue.push('foo', 2, function(err) {
      assert.equal(err, null);

      setTimeout(function() {
        assert.equal(attempts, 3);
        done();
      }, 1200);
    });
  });
});
