Node.js proxy interview task
=============================

Task description
--------------------

Create a simple Node.js proxy server. Schema: `POST => Node.js => write to file`

Server must save body contents of the incoming POST request into the file and return any previously cached information, if any.

**Proxy server implementation must rely only on standard Node.j modules!**

Solution
--------------------

To run this program:

* clone project
* `npm start`
* use [Postman](http://www.getpostman.com/) to send some `POST` requests to `localhost:52000`
* all cached information will be stored in `/tmp/node-proxy` directory and You can clean this directory running `npm run clearcache` script (*You must run `npm install` once prior to it*)

*Program will differentiate requests based on each request path, so requests to `localhost:52000/some/resource` and `localhost:52000/some/other/resource` will be cached into a different files!*

To run tests:

* `npm install`
* `npm start`
* followed by `npm test` in a separate terminal console

While program itself implemented utilizing standard Node.js modules only, testing requires installation of some additional modules like [Tape](https://github.com/substack/tape) and [SuperAgent](https://github.com/visionmedia/superagent)!
