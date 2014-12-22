### local-queue
#### A persistent job queue for the browser.

### Installation
```bash
npm install localq
```

### Basic Use
```js
var queue = require('localq')({
    concurrency: 1,     // how many jobs can run at once
    expire: null,       // how long until a job expires (ms)
    timeout: 5000,      // how long until a job timeouts & is considered "failed" (ms)
    retry: 3            // how many times a job should be retried
});

queue.on('job', function (job, callback) {
    console.log(job);   // prints: "foo"
    callback(null);
});

queue.on('error', function (err) {
    console.log(err);
});
```

```js
queue.push('foo');
```

### API
Events: job, error, drain
Methods: push(), start(), stop(), flush()

---

### To Build
```bash
make build
```

### To Test
```bash
make test
```
