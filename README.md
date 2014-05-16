# sanitize-html

<a href="http://apostrophenow.org/"><img src="https://raw.github.com/punkave/sanitize-html/master/logos/logo-box-madefor.png" align="right" /></a>

`sanitize-html` provides a simple HTML sanitizer with a clear API.

`sanitize-html` is tolerant. It is well suited for cleaning up HTML fragments such as those created by ckeditor and other rich text editors. It is especially handy for removing unwanted CSS when copying and pasting from Word.

`sanitize-html` allows you to specify the tags you want to permit, and the permitted attributes for each of those tags.

If a tag is not permitted, the contents of the tag are still kept, except for script and style tags.

The syntax of poorly closed `p` and `img` elements is cleaned up.

`href` attributes are validated to ensure they only contain `http`, `https`, `ftp` and `mailto` URLs. Relative URLs are also allowed. Ditto for `src` attributes.

HTML comments are not preserved.

## Requirements

`sanitize-html` is intended for use with Node. That's pretty much it. All of its npm dependencies are pure JavaScript. `sanitize-html` is built on the excellent `htmlparser2` module.

## How to use

    npm install sanitize-html

    var sanitizeHtml = require('sanitize-html');

    var dirty = 'some really tacky HTML';
    var clean = sanitizeHtml(dirty);

That will allow our default list of allowed tags and attributes through. It's a nice set, but probably not quite what you want. So:

    // Allow only a super restricted set of tags and attributes
    clean = sanitizeHtml(dirty, {
      allowedTags: [ 'b', 'i', 'em', 'strong', 'a' ],
      allowedAttributes: {
        'a': [ 'href' ]
      }
    });

Boom!

"I like your set but I want to add one more tag. Is there a convenient way?" Sure:

    clean = sanitizeHtml(dirty, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])
    });

If you do not specify `allowedTags` or `allowedAttributes` our default list is applied. So if you really want an empty list, specify one.

"What are the default options?"

    allowedTags: [ 'h3', 'h4', 'h5', 'h6', 'blockquote',
    'p', 'a', 'ul', 'ol', 'nl', 'li', 'b', 'i', 'strong',
    'em', 'strike', 'code', 'hr', 'br', 'div',
    'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td',
    'pre' ],
    allowedAttributes: {
      a: [ 'href', 'name', 'target' ],
      // We don't currently allow img itself by default, but this
      // would make sense if we did
      img: [ 'src' ]
    },
    // Lots of these won't come up by default because
    // we don't allow them
    selfClosing: [ 'img', 'br', 'hr', 'area', 'base',
      'basefont', 'input', 'link', 'meta' ]

### Transformations

What if you want to add or change an attribute? What if you want to transform one tag to another? No problem, it's simple!

The easiest way (will change all `ol` tags to `ul` tags):

    clean = sanitizeHtml(dirty, {
      transformTags: {
        'ol': 'ul',
      }
    });

The most advanced usage:

    clean = sanitizeHtml(dirty, {
      transformTags: {
        'ol': function(tagName, attribs) {
            // My own custom magic goes here

            return {
                tagName: 'ul',
                attribs: {
                    class: 'foo'
                }
            };
        }
      }
    });

There is also a helper method which should be enough for simple cases in which you want to change the tag and/or add some attributes:

    clean = sanitizeHtml(dirty, {
      transformTags: {
        'ol': sanitizeHtml.simpleTransform('ul', {class: 'foo'}),
      }
    });

The `simpleTransform` helper method has 3 parameters:

    simpleTransform(newTag, newAttributes, shouldMerge)

The last parameter (`shouldMerge`) is set to `true` by default. When `true`, `simpleTransform` will merge the current attributes with the new ones (`newAttributes`). When `false`, all existing attributes are discarded.

### Filters

You can provide a filter function to remove unwanted tags. Let's suppose we need to remove empty `a` tags like 
```html
<a href="page/html"></a>
```
```javascript
sanitizeHtml(
    '<p>This is <a href="http://www.linux.org"></a><br/>Linux</p>',
    {
        exclusiveFilter: function(frame) {
            return frame.tag === 'a' && !frame.text.trim();
        }
    }
);
```

## Changelog
1.1.4: custom exclusion filter.

1.1.3: moved to lodash. 1.1.2 pointed to the wrong version of lodash.

1.1.0: the `transformTags` option was added. Thanks to [kl3ryk](https://github.com/kl3ryk).

1.0.3: fixed several more javascript URL attack vectors after [studying the XSS filter evasion cheat sheet](https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet) to better understand my enemy. Whitespace characters (codes from 0 to 32), which browsers ignore in URLs in certain cases allowing the "javascript" scheme to be snuck in, are now stripped out when checking for naughty URLs. Thanks again to [pinpickle](https://github.com/pinpickle).

1.0.2: fixed a javascript URL attack vector. naughtyHref must entity-decode URLs and also check for mixed-case scheme names. Thanks to [pinpickle](https://github.com/pinpickle).

1.0.1: Doc tweaks.

1.0.0: If the style tag is disallowed, then its content should be dumped, so that it doesn't appear as text. We were already doing this for script tags, however in both cases the content is now preserved if the tag is explicitly allowed.

We're rocking our tests and have been working great in production for months, so: declared 1.0.0 stable.

0.1.3: do not double-escape entities in attributes or text. Turns out the "text" provided by htmlparser2 is already escaped.

0.1.2: packaging error meant it wouldn't install properly.

0.1.1: discard the text of script tags.

0.1.0: initial release.

## About P'unk Avenue and Apostrophe

`sanitize-html` was created at [P'unk Avenue](http://punkave.com) for use in Apostrophe, an open-source content management system built on node.js. If you like `sanitize-html` you should definitely [check out apostrophenow.org](http://apostrophenow.org). Also be sure to visit us on [github](http://github.com/punkave).

## Support

Feel free to open issues on [github](http://github.com/punkave/sanitize-html).

<a href="http://punkave.com/"><img src="https://raw.github.com/punkave/sanitize-html/master/logos/logo-box-builtby.png" /></a>

