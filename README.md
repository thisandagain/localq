### localq
#### A persistent job queue for the browser.

### Installation
```bash
npm install localq
```

### Basic Use
```js
var localq = require('localq');
var queue = localq({
    expire: null,       // how long until a job expires (ms)
    timeout: 5000,      // how long until a job timeouts & is considered "failed" (ms)
    retry: 3,           // how many times a job should be retried

    interval: 1000,     // speed at which the queue looks for new jobs (ms)
    size: 4980736,      // maximum size of the queue (bytes)
    name: 'localq',     // name of the database within IndexedDB

    debug: false        // print status messages to the console
});

queue.worker = function (job, callback) {
    console.dir(job);   // prints "Do some work!"
    callback('Oh no! It failed');
};
```

```js
queue.push('Do some work!', 5, function (err) {
    console.dir(err);
});
```

### API
#### Properties:
expire, timeout, retry, interval, size, name, debug

##### Methods: 
push(), flush(), start(), pause()

---

### To Build
```bash
npm run build
```

### To Test
```bash
npm test
```
