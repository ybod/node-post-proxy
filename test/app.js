'use strict'
const test = require('tape');
const request = require('superagent');
const rimraf = require('rimraf');
const path = require('path');
const config = require('../config');
const TEST_DIR = '__test__';

test('processRequest: caches body contents into a file and returns previously cached content', (t) => {
  const reqUrl1 = `localhost:${config.port}/${TEST_DIR}/request/path/animals`;
  const reqUrl2 = `localhost:${config.port}/${TEST_DIR}/request/path/fruits`;
  const reqBody1 = { name: 'Manny', species: 'cat' };
  const reqBody2 = { fruit: 'Apple', color: 'red' };

  request
    .post(reqUrl1)
    .send(reqBody1)
    .end((err, res) => {
      t.error(err);

      request
        .post(reqUrl2)
        .send(reqBody2)
        .end((err, res) => {
          t.error(err);

          request
            .post(reqUrl1)
            .send('')
            .end((err, res) => {
              t.error(err);
              t.equal(res.res.statusCode, 200);
              t.equal(res.res.text, JSON.stringify(reqBody1));

              request
                .post(reqUrl2)
                .send('')
                .end((err, res) => {
                  t.error(err);
                  t.equal(res.res.statusCode, 200);
                  t.equal(res.res.text, JSON.stringify(reqBody2));
                  t.end()
                });
            });
        });
    });
});

test('processRequest: can process only POST request', (t) => {
  const reqUrl = `localhost:${config.port}/some/resource`;

  request
    .get(reqUrl)
    .end((err, res) => {
      t.equal(res.res.statusCode, 405);
      t.equal(res.res.text, 'Only POST request can be processed by this App!');
        t.end();
    });
});

test.onFinish(() => rimraf.sync(path.join(config.tmp, TEST_DIR + '/*')));
