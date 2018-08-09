const expect = require('chai').expect;
const Util = require('../lib/util');

describe('Util', function() {

  describe('createScriptTag', function() {

    it('should return a script tag given the source', function() {

      const test_source = 'test-source.js';
      const expected = `<script src="${test_source}"></script>`;

      expect(Util.createScriptTag(test_source)).to.equal(expected);

    });

  });

  describe('replaceScriptPath', function() {

    it('should return a script tag given the source', function() {

      const test_source = 'test-source.js';
      const html = `<html><head></head><body><h1>hi</h1><script src="${test_source}"></script></body>`;

      const new_source = 'new-awesome.js';
      const expected = `<html><head></head><body><h1>hi</h1><script src="${new_source}"></script></body>`;

      expect(Util.replaceScriptPath(html, test_source, new_source)).to.equal(expected);

    });

  });

});