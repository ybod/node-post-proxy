'use strict'
const test = require('tape');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const proxy = require('../proxy');
const config = require('../config');

const TEST_DIR = '__test__';

test('generatePathFromUrl: incorrect or empty elements, whitespaces and non alphabetic symbols are removed from the path', (t) => {
  const path1 = '/path/to/some/resource';
  const path2 = '/Path/To/Some/Resource/';
  const path3 = '/1234/ъ!-=ё/some-path/ /';
  const path4 = '/../../somefilename';
  const path5 = '';
  const path6 = '//';

  t.equal(proxy.generatePathFromUrl(path1), '/path/to/some/resource.node-proxy.cache');
  t.equal(proxy.generatePathFromUrl(path2), '/path/to/some/resource.node-proxy.cache');
  t.equal(proxy.generatePathFromUrl(path3), '/1234/_____/some_path.node-proxy.cache');
  t.equal(proxy.generatePathFromUrl(path4), '/__/__/somefilename.node-proxy.cache');
  t.equal(proxy.generatePathFromUrl(path5), '/.node-proxy.cache');
  t.equal(proxy.generatePathFromUrl(path6), '/.node-proxy.cache');
  t.end();
});

test('mkDir: creating a set of nested directories recursively', (t) => {
  const testPath = path.join(config.tmp, TEST_DIR + '/a/bb/ccc/dddd/eeeee/ffffff/___/1234567');

  proxy.mkDir(testPath);
  t.ok(fs.statSync(testPath).isDirectory());

  t.end();
});

test('processFile: create non-existent file, returns content of existing file', (t) => {
  const testPath = path.join(config.tmp, TEST_DIR + '/request/path/someresource');
  proxy.processFile(testPath, 'TEST BODY CONTENTS');

  t.ok(fs.statSync(testPath).isFile());
  t.equal(fs.readFileSync(testPath, 'utf8'), 'TEST BODY CONTENTS');

  const cached_content = proxy.processFile(testPath, 'NEW BODY CONTENTS');
  t.equal(cached_content, 'TEST BODY CONTENTS');
  t.equal(fs.readFileSync(testPath, 'utf8'), 'NEW BODY CONTENTS');

  t.end();
});

test('processRequest: caches body contents into a file and returns previously cached content', (t) => {
  const reqUrl = TEST_DIR + '/request/path/lorem';
  const body1 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  const body2 = 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  const body3 = 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.';

  proxy.processRequest(reqUrl, body1, config.tmp);
  t.equal(proxy.processRequest(reqUrl, '', config.tmp), body1);
  t.equal(proxy.processRequest(reqUrl, body2, config.tmp), '');
  t.equal(proxy.processRequest(reqUrl, '', config.tmp), body2);
  t.equal(proxy.processRequest(reqUrl, body3, config.tmp), '');
  t.equal(proxy.processRequest(reqUrl, '', config.tmp), body3);

  t.end();
});

test.onFinish(() => rimraf.sync(path.join(config.tmp, TEST_DIR + '/*')));
