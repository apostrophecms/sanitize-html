var assert = require("assert");
describe('sanitizeHtml', function() {
  var sanitizeHtml;
  it('should be successfully initialized', function() {
    sanitizeHtml = require('../index.js');
  });
  it('should pass through simple well-formed whitelisted markup', function() {
    assert.equal(sanitizeHtml('<div><p>Hello <b>there</b></p></div>'), '<div><p>Hello <b>there</b></p></div>');
  });
  it('should pass through all markup if allowedTags and allowedAttributes are set to false', function() {
    assert.equal(sanitizeHtml('<div><wiggly worms="ewww">hello</wiggly></div>', {
      allowedTags: false,
      allowedAttributes: false
    }), '<div><wiggly worms="ewww">hello</wiggly></div>');
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
    assert.equal(sanitizeHtml('<a href="http://google.com">google</a><a href="https://google.com">https google</a><a href="ftp://example.com">ftp</a><a href="mailto:test@test.com">mailto</a><a href="/relative.html">relative</a><a href="javascript:alert(0)">javascript</a>'), '<a href="http://google.com">google</a><a href="https://google.com">https google</a><a href="ftp://example.com">ftp</a><a href="mailto:test@test.com">mailto</a><a href="/relative.html">relative</a><a>javascript</a>');
  });
  it('should cope identically with capitalized attributes and tags and should tolerate capitalized schemes', function() {
    assert.equal(sanitizeHtml('<A HREF="http://google.com">google</a><a href="HTTPS://google.com">https google</a><a href="ftp://example.com">ftp</a><a href="mailto:test@test.com">mailto</a><a href="/relative.html">relative</a><a href="javascript:alert(0)">javascript</a>'), '<a href="http://google.com">google</a><a href="HTTPS://google.com">https google</a><a href="ftp://example.com">ftp</a><a href="mailto:test@test.com">mailto</a><a href="/relative.html">relative</a><a>javascript</a>');
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
    assert.equal(sanitizeHtml('<a href="&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;">Hax</a>'), '<a>Hax</a>');
  });
  it('should dump an uppercase javascript url', function() {
    assert.equal(sanitizeHtml('<a href="JAVASCRIPT:alert(\'foo\')">Hax</a>'), '<a>Hax</a>');
  });
  it('should dump a javascript URL with a comment in the middle (probably only respected by browsers in XML data islands, but just in case someone enables those)', function() {
    assert.equal(sanitizeHtml('<a href="java<!-- -->script:alert(\'foo\')">Hax</a>'), '<a>Hax</a>');
  });
  it('should not mess up a hashcode with a : in it', function() {
    assert.equal(sanitizeHtml('<a href="awesome.html#this:stuff">Hi</a>'), '<a href="awesome.html#this:stuff">Hi</a>');
  });
  it('should dump character codes 1-32 before testing scheme', function() {
    assert.equal(sanitizeHtml('<a href="java\0&#14;\t\r\n script:alert(\'foo\')">Hax</a>'), '<a>Hax</a>');
  });
  it('should dump character codes 1-32 even when escaped with padding rather than trailing ;', function() {
    assert.equal(sanitizeHtml('<a href="java&#0000000script:alert(\'foo\')">Hax</a>'), '<a>Hax</a>');
  });
  it('should still like nice schemes', function() {
    assert.equal(sanitizeHtml('<a href="http://google.com/">Hi</a>'), '<a href="http://google.com/">Hi</a>');
  });
  it('should still like nice relative URLs', function() {
    assert.equal(sanitizeHtml('<a href="hello.html">Hi</a>'), '<a href="hello.html">Hi</a>');
  });
  it('should replace ol to ul', function() {
    assert.equal(sanitizeHtml('<ol><li>Hello world</li></ol>', { transformTags: {ol: 'ul'} }), '<ul><li>Hello world</li></ul>');
  });
  it('should replace ol to ul and add class attribute with foo value', function() {
    assert.equal(sanitizeHtml('<ol><li>Hello world</li></ol>', { transformTags: {ol: sanitizeHtml.simpleTransform('ul', {class: 'foo'})}, allowedAttributes: { ul: ['class'] } }), '<ul class="foo"><li>Hello world</li></ul>');
  });
  it('should replace ol to ul, left attributes foo and bar untouched, remove baz attribute and add class attributte with foo value', function() {
    assert.equal(sanitizeHtml('<ol foo="foo" bar="bar" baz="baz"><li>Hello world</li></ol>', { transformTags: {ol: sanitizeHtml.simpleTransform('ul', {class: 'foo'})}, allowedAttributes: { ul: ['foo', 'bar', 'class'] } }), '<ul foo="foo" bar="bar" class="foo"><li>Hello world</li></ul>');
  });
  it('should replace ol to ul and replace all attributes to class attribute with foo value', function() {
    assert.equal(sanitizeHtml('<ol foo="foo" bar="bar" baz="baz"><li>Hello world</li></ol>', { transformTags: {ol: sanitizeHtml.simpleTransform('ul', {class: 'foo'}, false)}, allowedAttributes: { ul: ['foo', 'bar', 'class'] } }), '<ul class="foo"><li>Hello world</li></ul>');
  });
  it('should replace ol to ul and add attribute class with foo value and attribute bar with bar value', function() {
    assert.equal(sanitizeHtml('<ol><li>Hello world</li></ol>', { transformTags: {ol: function(tagName, attribs){
      attribs.class = 'foo';
      attribs.bar = 'bar';
      return {
        tagName: 'ul',
        attribs: attribs
      }
    }}, allowedAttributes: { ul: ['bar', 'class'] } }), '<ul class="foo" bar="bar"><li>Hello world</li></ul>');
  });

  it('should skip an empty link', function() {
     assert.strictEqual(
     sanitizeHtml('<p>This is <a href="http://www.linux.org"></a><br/>Linux</p>', {
             exclusiveFilter: function (frame) {
                 return frame.tag === 'a' && !frame.text.trim();
             }
         }),
         '<p>This is <br />Linux</p>'
        );
    });

    it("Should expose a node's inner text and inner HTML to the filter", function() {
        assert.strictEqual(
            sanitizeHtml('<p>12<a href="http://www.linux.org"><br/>3<br></a><span>4</span></p>', {
                exclusiveFilter : function(frame) {
                    if (frame.tag === 'p') {
                        assert.strictEqual(frame.text, '124');
                    } else if (frame.tag === 'a') {
                        assert.strictEqual(frame.text, '3');
                        return true;
                    } else if (frame.tag === 'br') {
                        assert.strictEqual(frame.text, '');
                    } else {
                        assert.fail('p, a, br', frame.tag);
                    }
                    return false;
                }
            }),
            '<p>124</p>'
        );
    });

  it('Should collapse nested empty elements', function() {
        assert.strictEqual(
            sanitizeHtml('<p><a href="http://www.linux.org"><br/></a></p>', {
                    exclusiveFilter : function(frame) {
                        return (frame.tag === 'a' || frame.tag === 'p' ) && !frame.text.trim();
                    }
                }),
            ''
        );
  });
  it('Exclusive filter should not affect elements which do not match the filter condition', function () {
      assert.strictEqual(
          sanitizeHtml('I love <a href="www.linux.org" target="_hplink">Linux</a> OS',
              {
                  exclusiveFilter: function (frame) {
                      return (frame.tag === 'a') && !frame.text.trim();
                  }
              }),
          'I love <a href="www.linux.org" target="_hplink">Linux</a> OS'
      );
  });
  it('should disallow data URLs with default allowedSchemes', function() {
    assert.equal(
      sanitizeHtml(
        // teeny-tiny valid transparent GIF in a data URL
        '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />',
        {
          allowedTags: [ 'img' ]
        }
      ),
      '<img />'
    );
  });
  it('should allow data URLs with custom allowedSchemes', function() {
    assert.equal(
      sanitizeHtml(
        // teeny-tiny valid transparent GIF in a data URL
        '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />',
        {
          allowedTags: [ 'img', 'p' ],
          allowedSchemes: [ 'data', 'http' ]
        }
      ),
      '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />'
    );
  });
  it('should allow specific classes when whitelisted with allowedClasses', function() {
    assert.equal(
      sanitizeHtml(
        '<p class="nifty simple dippy">whee</p>',
        {
          allowedTags: [ 'p' ],
          allowedClasses: {
            p: [ 'nifty' ]
          }
        }
      ),
      '<p class="nifty">whee</p>'
    );
  });
  it('should not act weird when the class attribute is empty', function() {
    assert.equal(
      sanitizeHtml(
        '<p class="">whee</p>',
        {
          allowedTags: [ 'p' ],
          allowedClasses: {
            p: [ 'nifty' ]
          }
        }
      ),
      '<p>whee</p>'
    );
  });
  it('should not crash on bad markup', function() {
    assert.equal(
      sanitizeHtml(
        "<p a"
      ),
      ''
    );
  });
  it('should not allow a naked = sign followed by an unrelated attribute to result in one merged attribute with unescaped double quote marks', function() {
    assert.equal(
      sanitizeHtml(
        '<IMG SRC= onmouseover="alert(\'XSS\');">',
        {
          allowedTags: [ 'img' ],
          allowedAttributes: {
            img: [ 'src' ]
          }
        }
      ),
      // This is weird but not dangerous. Without the &quot there
      // would probably be some way to make it come out as a
      // separate attribute
      '<img src="onmouseover=&quot;alert(\'XSS\');&quot;" />'
    );
  });
  it('should not filter if exclusive filter does not match after transforming tags', function() {
    assert.equal(
      sanitizeHtml(
        '<a href="test.html">test</a>',
        {
          allowedTags: [ 'a' ],
          allowedAttributes: { a: ['href', 'target']},
          transformTags: {
            'a': function (tagName, attribs) {
              if (!attribs.href)
                return false;
              return {
                tagName: tagName,
                attribs: {
                  target: '_blank',
                  href: attribs.href
                }
              };
            }
          },
          exclusiveFilter: function(frame) {
            return frame.tag === 'a' && frame.text.trim() == 'blah';
          }
        }
      ),
      '<a target="_blank" href="test.html">test</a>'
    )
  });
  it('should filter if exclusive filter does match after transforming tags', function() {
    assert.equal(
      sanitizeHtml(
        '<a href="test.html">blah</a>',
        {
          allowedTags: [ 'a' ],
          allowedAttributes: {a: ['href', 'target']},
          transformTags: {
            'a': function (tagName, attribs) {
              if (!attribs.href)
                return false;
              return {
                tagName: tagName,
                attribs: {
                  target: '_blank',
                  href: attribs.href
                }
              };
            }
          },
          exclusiveFilter: function(frame) {
            return frame.tag === 'a' && frame.text.trim() == 'blah';
          }
        }
      ),
      ''
    )
  });
});
