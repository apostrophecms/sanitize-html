var assert = require("assert");
describe('sanitizeHtml', function() {
  var sanitizeHtml;
  it('should be successfully initialized', function() {
    sanitizeHtml = require('../index.js');
  });
  it('should pass through simple well-formed whitelisted markup', function() {
    assert.equal(sanitizeHtml('<div><p>Hello <b>there</b></p></div>'), '<div><p>Hello <b>there</b></p></div>');
  });
  it('should respect text nodes at top level', function() {
    assert.equal(sanitizeHtml('Blah blah blah<p>Whee!</p>'), 'Blah blah blah<p>Whee!</p>');
  });
  it('should reject markup not whitelisted without destroying its text', function() {
    assert.equal(sanitizeHtml('<div><wiggly>Hello</wiggly></div>'), '<div>Hello</div>');
  });
  it('should accept a custom list of allowed tags', function() {
    assert.equal(sanitizeHtml('<blue><red><green>Cheese</green></red></blue>', { allowedTags: [ 'blue', 'green' ] }), '<blue><green>Cheese</green></blue>');
  });
  it('should reject attributes not whitelisted', function() {
    assert.equal(sanitizeHtml('<a href="foo.html" whizbang="whangle">foo</a>'), '<a href="foo.html">foo</a>');
  });
  it('should accept a custom list of allowed attributes per element', function() {
    assert.equal(sanitizeHtml('<a href="foo.html" whizbang="whangle">foo</a>', { allowedAttributes: { a: [ 'href', 'whizbang' ] } } ), '<a href="foo.html" whizbang="whangle">foo</a>');
  });
  it('should clean up unclosed img tags and p tags', function() {
    assert.equal(sanitizeHtml('<img src="foo.jpg"><p>Whee<p>Again<p>Wow<b>cool</b>', { allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])}), '<img src="foo.jpg" /><p>Whee</p><p>Again</p><p>Wow<b>cool</b></p>');
  });
  it('should reject hrefs that are not relative, ftp, http, https or mailto', function() {
    assert.equal(sanitizeHtml('<a href="http://google.com">google</a><a href="https://google.com">https google</a><a href="ftp://example.com">ftp</a><a href="mailto:test@test.com">mailto</a><a href="/relative.html">relative</a><a href="javascript:alert(0)">javascript</a>'), '<a href="http://google.com">google</a><a href="https://google.com">https google</a><a href="ftp://example.com">ftp</a><a href="mailto:test@test.com">mailto</a><a href="/relative.html">relative</a><a href>javascript</a>');
  });
  it('should cope identically with capitalized attributes and tags and should tolerate capitalized schemes', function() {
    assert.equal(sanitizeHtml('<A HREF="http://google.com">google</a><a href="HTTPS://google.com">https google</a><a href="ftp://example.com">ftp</a><a href="mailto:test@test.com">mailto</a><a href="/relative.html">relative</a><a href="javascript:alert(0)">javascript</a>'), '<a href="http://google.com">google</a><a href="HTTPS://google.com">https google</a><a href="ftp://example.com">ftp</a><a href="mailto:test@test.com">mailto</a><a href="/relative.html">relative</a><a href>javascript</a>');
  });
  it('should drop the content of script elements', function() {
    assert.equal(sanitizeHtml('<script>alert("ruhroh!");</script><p>Paragraph</p>'), '<p>Paragraph</p>');
  });
  it('should drop the content of style elements', function() {
    assert.equal(sanitizeHtml('<style>.foo { color: blue; }</style><p>Paragraph</p>'), '<p>Paragraph</p>');
  });
  it('should preserve entities as such', function() {
    assert.equal(sanitizeHtml('<a name="&lt;silly&gt;">&lt;Kapow!&gt;</a>'), '<a name="&lt;silly&gt;">&lt;Kapow!&gt;</a>');
  });
  it('should dump comments', function() {
    assert.equal(sanitizeHtml('<p><!-- Blah blah -->Whee</p>'), '<p>Whee</p>');
  });
  it('should dump a sneaky encoded javascript url', function() {
    assert.equal(sanitizeHtml('<a href="&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;">Hax</a>'), '<a href>Hax</a>');
  });
  it('should dump an uppercase javascript url', function() {
    assert.equal(sanitizeHtml('<a href="JAVASCRIPT:alert(\'foo\')">Hax</a>'), '<a href>Hax</a>');
  });
  it('should dump character codes 1-32 before testing scheme', function() {
    assert.equal(sanitizeHtml('<a href="java\0&#14;\t\r\n script:alert(\'foo\')">Hax</a>'), '<a href>Hax</a>');
  });
  it('should dump character codes 1-32 even when escaped with padding rather than trailing ;', function() {
    assert.equal(sanitizeHtml('<a href="java&#0000000script:alert(\'foo\')">Hax</a>'), '<a href>Hax</a>');
  });
  it('should still like nice schemes', function() {
    assert.equal(sanitizeHtml('<a href="http://google.com/">Hi</a>'), '<a href="http://google.com/">Hi</a>');
  });
  it('should still like nice relative URLs', function() {
    assert.equal(sanitizeHtml('<a href="hello.html">Hi</a>'), '<a href="hello.html">Hi</a>');
  });
});

