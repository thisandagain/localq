var queue = require('../')();

queue.on('job', function (job, callback) {
    callback(null);
});

queue.on('error', function (err) {
    
});

queue.on('drain', function () {

});

queue.push('foo');
queue.push('bar');
queue.push('baz');

