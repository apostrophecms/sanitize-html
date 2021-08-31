# sanitize-html

[![CircleCI](https://circleci.com/gh/apostrophecms/sanitize-html/tree/main.svg?style=svg)](https://circleci.com/gh/apostrophecms/sanitize-html/tree/main)

<a href="https://apostrophecms.com/"><img src="https://raw.githubusercontent.com/apostrophecms/sanitize-html/main/logos/logo-box-madefor.png" align="right" /></a>

sanitize-html provides a simple HTML sanitizer with a clear API.

sanitize-html is tolerant. It is well suited for cleaning up HTML fragments such as those created by CKEditor and other rich text editors. It is especially handy for removing unwanted CSS when copying and pasting from Word.

sanitize-html allows you to specify the tags you want to permit, and the permitted attributes for each of those tags.

If a tag is not permitted, the contents of the tag are not discarded. There are
some exceptions to this, discussed below in the "Discarding the entire contents
of a disallowed tag" section.

The syntax of poorly closed `p` and `img` elements is cleaned up.

`href` attributes are validated to ensure they only contain `http`, `https`, `ftp` and `mailto` URLs. Relative URLs are also allowed. Ditto for `src` attributes.

Allowing particular urls as a `src` to an iframe tag by filtering hostnames is also supported.

HTML comments are not preserved.

## Requirements

sanitize-html is intended for use with Node.js and supports Node 10+. All of its npm dependencies are pure JavaScript. sanitize-html is built on the excellent `htmlparser2` module.

### Regarding TypeScript

sanitize-html is not written in TypeScript and there is no plan to directly support it. There is a community supported typing definition, [`@types/sanitize-html`](https://www.npmjs.com/package/@types/sanitize-html), however.
```bash
npm install -D @types/sanitize-html
```
If `esModuleInterop=true` is not set in your `tsconfig.json` file, you have to import it with:

```javascript
import * as sanitizeHtml from 'sanitize-html';
```

Any questions or problems while using `@types/sanitize-html` should be directed to its maintainers as directed by that project's contribution guidelines.

## How to use

### Browser

*Think first: why do you want to use it in the browser?* Remember, *servers must never trust browsers.* You can't sanitize HTML for saving on the server anywhere else but on the server.

But, perhaps you'd like to display sanitized HTML immediately in the browser for preview. Or ask the browser to do the sanitization work on every page load. You can if you want to!

* Install the package:

```bash
npm install sanitize-html
```
or
```
yarn add sanitize-html
```

The primary change in the 2.x version of sanitize-html is that it no longer includes a build that is ready for browser use. Developers are expected to include sanitize-html in their project builds (e.g., webpack) as they would any other dependency. So while sanitize-html is no longer ready to link to directly in HTML, developers can now more easily process it according to their needs.

Once built and linked in the browser with other project Javascript, it can be used to sanitize HTML strings in front end code:

```javascript
import sanitizeHtml from 'sanitize-html';

const html = "<strong>hello world</strong>";
console.log(sanitizeHtml(html));
console.log(sanitizeHtml("<img src=x onerror=alert('img') />"));
console.log(sanitizeHtml("console.log('hello world')"));
console.log(sanitizeHtml("<script>alert('hello world')</script>"));
```

### Node (Recommended)

Install module from console:

```bash
npm install sanitize-html
```

Import the module:

```js
// In ES modules
import sanitizeHtml from 'sanitize-html';

// Or in CommonJS
const sanitizeHtml = require('sanitize-html');
```

Use it in your JavaScript app:

```js
const dirty = 'some really tacky HTML';
const clean = sanitizeHtml(dirty);
```

That will allow our [default list of allowed tags and attributes](#default-options) through. It's a nice set, but probably not quite what you want. So:

```js
// Allow only a super restricted set of tags and attributes
const clean = sanitizeHtml(dirty, {
  allowedTags: [ 'b', 'i', 'em', 'strong', 'a' ],
  allowedAttributes: {
    'a': [ 'href' ]
  },
  allowedIframeHostnames: ['www.youtube.com']
});
```

Boom!

### Default options

```js
allowedTags: [
  "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
  "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
  "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
  "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
  "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
  "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
  "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr"
],
disallowedTagsMode: 'discard',
allowedAttributes: {
  a: [ 'href', 'name', 'target' ],
  // We don't currently allow img itself by default, but this
  // would make sense if we did. You could add srcset here,
  // and if you do the URL is checked for safety
  img: [ 'src' ]
},
// Lots of these won't come up by default because we don't allow them
selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ],
// URL schemes we permit
allowedSchemes: [ 'http', 'https', 'ftp', 'mailto', 'tel' ],
allowedSchemesByTag: {},
allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
allowProtocolRelative: true,
enforceHtmlBoundary: false
```

### Common use cases

#### "I like your set but I want to add one more tag. Is there a convenient way?"

Sure:

```js
const clean = sanitizeHtml(dirty, {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])
});
```

If you do not specify `allowedTags` or `allowedAttributes`, our default list is applied. So if you really want an empty list, specify one.

#### "What if I want to allow all tags or all attributes?"

Simple! Instead of leaving `allowedTags` or `allowedAttributes` out of the options, set either
one or both to `false`:

```js
allowedTags: false,
allowedAttributes: false
```

#### "What if I don't want to allow *any* tags?"

Also simple!  Set `allowedTags` to `[]` and `allowedAttributes` to `{}`.

```js
allowedTags: [],
allowedAttributes: {}
```

#### "What if I want disallowed tags to be escaped rather than discarded?"

If you set `disallowedTagsMode` to `discard` (the default), disallowed tags are discarded. Any text content or subtags is still included, depending on whether the individual subtags are allowed.

If you set `disallowedTagsMode` to `escape`, the disallowed tags are escaped rather than discarded. Any text or subtags is handled normally.

If you set `disallowedTagsMode` to `recursiveEscape`, the disallowed tags are escaped rather than discarded, and the same treatment is applied to all subtags, whether otherwise allowed or not.

#### "What if I want to allow only specific values on some attributes?"

When configuring the attribute in `allowedAttributes` simply use an object with attribute `name` and an allowed `values` array. In the following example `sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-scripts"` would become `sandbox="allow-popups allow-scripts"`:

```js
allowedAttributes: {
  iframe: [
    {
      name: 'sandbox',
      multiple: true,
      values: ['allow-popups', 'allow-same-origin', 'allow-scripts']
    }
  ]
}
```

With `multiple: true`, several allowed values may appear in the same attribute, separated by spaces. Otherwise the attribute must exactly match one and only one of the allowed values.

### Wildcards for attributes

You can use the `*` wildcard to allow all attributes with a certain prefix:

```js
allowedAttributes: {
  a: [ 'href', 'data-*' ]
}
```

Also you can use the `*` as name for a tag, to allow listed attributes to be valid for any tag:

```js
allowedAttributes: {
  '*': [ 'href', 'align', 'alt', 'center', 'bgcolor' ]
}
```

## Additional options

### Allowed CSS Classes

If you wish to allow specific CSS classes on a particular element, you can do so with the `allowedClasses` option. Any other CSS classes are discarded.

This implies that the `class` attribute is allowed on that element.

```javascript
// Allow only a restricted set of CSS classes and only on the p tag
const clean = sanitizeHtml(dirty, {
  allowedTags: [ 'p', 'em', 'strong' ],
  allowedClasses: {
    'p': [ 'fancy', 'simple' ]
  }
});
```

Similar to `allowedAttributes`, you can use `*` to allow classes with a certain prefix, or use `*` as a tag name to allow listed classes to be valid for any tag:
```js
allowedClasses: {
  'code': [ 'language-*', 'lang-*' ],
  '*': [ 'fancy', 'simple' ]
}
```

### Allowed CSS Styles

If you wish to allow specific CSS _styles_ on a particular element, you can do that with the `allowedStyles` option. Simply declare your desired attributes as regular expression options within an array for the given attribute. Specific elements will inherit allowlisted attributes from the global (`*`) attribute. Any other CSS classes are discarded.

**You must also use `allowedAttributes`** to activate the `style` attribute for the relevant elements. Otherwise this feature will never come into play.

**When constructing regular expressions, don't forget `^` and `$`.** It's not enough to say "the string should contain this." It must also say "and only this."

**URLs in inline styles are NOT filtered by any mechanism other than your regular expression.**

```javascript
const clean = sanitizeHtml(dirty, {
        allowedTags: ['p'],
        allowedAttributes: {
          'p': ["style"],
        },
        allowedStyles: {
          '*': {
            // Match HEX and RGB
            'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
            'text-align': [/^left$/, /^right$/, /^center$/],
            // Match any number with px, em, or %
            'font-size': [/^\d+(?:px|em|%)$/]
          },
          'p': {
            'font-size': [/^\d+rem$/]
          }
        }
      });
```

### Discarding text outside of ```<html></html>``` tags

Some text editing applications generate HTML to allow copying over to a web application. These can sometimes include undesireable control characters after terminating `html` tag. By default sanitize-html will not discard these characters, instead returning them in sanitized string. This behaviour can be modified using `enforceHtmlBoundary` option.

Setting this option to true will instruct sanitize-html to discard all characters outside of `html` tag boundaries -- before `<html>` and after `</html>` tags.

```js
enforceHtmlBoundary: true
```

### htmlparser2 Options

sanitize-html is built on `htmlparser2`. By default the only option passed down is `decodeEntities: true`. You can set the options to pass by using the parser option.

**Security note: changing the `parser` settings can be risky.** In particular, `decodeEntities: false` has known security concerns and a complete test suite does not exist for every possible combination of settings when used with `sanitize-html`. If security is your goal we recommend you use the defaults rather than changing `parser`, except for the `lowerCaseTags` option.

```javascript
const clean = sanitizeHtml(dirty, {
  allowedTags: ['a'],
  parser: {
    lowerCaseTags: true
  }
});
```
See the [htmlparser2 wiki](https://github.com/fb55/htmlparser2/wiki/Parser-options) for the full list of possible options.

### Transformations

What if you want to add or change an attribute? What if you want to transform one tag to another? No problem, it's simple!

The easiest way (will change all `ol` tags to `ul` tags):

```js
const clean = sanitizeHtml(dirty, {
  transformTags: {
    'ol': 'ul',
  }
});
```

The most advanced usage:

```js
const clean = sanitizeHtml(dirty, {
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
```

You can specify the `*` wildcard instead of a tag name to transform all tags.

There is also a helper method which should be enough for simple cases in which you want to change the tag and/or add some attributes:

```js
const clean = sanitizeHtml(dirty, {
  transformTags: {
    'ol': sanitizeHtml.simpleTransform('ul', {class: 'foo'}),
  }
});
```

The `simpleTransform` helper method has 3 parameters:

```js
simpleTransform(newTag, newAttributes, shouldMerge)
```

The last parameter (`shouldMerge`) is set to `true` by default. When `true`, `simpleTransform` will merge the current attributes with the new ones (`newAttributes`). When `false`, all existing attributes are discarded.

You can also add or modify the text contents of a tag:

```js
const clean = sanitizeHtml(dirty, {
  transformTags: {
    'a': function(tagName, attribs) {
      return {
        tagName: 'a',
        text: 'Some text'
      };
    }
  }
});
```
For example, you could transform a link element with missing anchor text:
```js
<a href="http://somelink.com"></a>
```
To a link with anchor text:
```js
<a href="http://somelink.com">Some text</a>
```

### Filters

You can provide a filter function to remove unwanted tags. Let's suppose we need to remove empty `a` tags like:

```html
<a href="page.html"></a>
```

We can do that with the following filter:

```js
sanitizeHtml(
  '<p>This is <a href="http://www.linux.org"></a><br/>Linux</p>',
  {
    exclusiveFilter: function(frame) {
      return frame.tag === 'a' && !frame.text.trim();
    }
  }
);
```

The `frame` object supplied to the callback provides the following attributes:

- `tag`: The tag name, i.e. `'img'`.
- `attribs`: The tag's attributes, i.e. `{ src: "/path/to/tux.png" }`.
- `text`: The text content of the tag.
- `mediaChildren`: Immediate child tags that are likely to represent self-contained media (e.g., `img`, `video`, `picture`, `iframe`). See the `mediaTags` variable in `src/index.js` for the full list.
- `tagPosition`: The index of the tag's position in the result string.

You can also process all text content with a provided filter function. Let's say we want an ellipsis instead of three dots.

```html
<p>some text...</p>
```

We can do that with the following filter:

```js
sanitizeHtml(
  '<p>some text...</p>',
  {
    textFilter: function(text, tagName) {
      if (['a'].indexOf(tagName) > -1) return //Skip anchor tags

      return text.replace(/\.\.\./, '&hellip;');
    }
  }
);
```

Note that the text passed to the `textFilter` method is already escaped for safe display as HTML. You may add markup and use entity escape sequences in your `textFilter`.

### Iframe Filters

If you would like to allow iframe tags but want to control the domains that are allowed through, you can provide an array of hostnames and/or array of domains that you would like to allow as iframe sources. This hostname is a property in the options object passed as an argument to the sanitize-html function.

These arrays will be checked against the html that is passed to the function and return only `src` urls that include the allowed hostnames or domains in the object. The url in the html that is passed must be formatted correctly (valid hostname) as an embedded iframe otherwise the module will strip out the src from the iframe.

Make sure to pass a valid hostname along with the domain you wish to allow, i.e.:

```js
allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
allowedIframeDomains: ['zoom.us']
```

You may also specify whether or not to allow relative URLs as iframe sources.

```js
allowIframeRelativeUrls: true
```

Note that if unspecified, relative URLs will be allowed by default if no hostname or domain filter is provided but removed by default if a hostname or domain filter is provided.

**Remember that the `iframe` tag must be allowed as well as the `src` attribute.**

For example:

```javascript
const clean = sanitizeHtml('<p><iframe src="https://www.youtube.com/embed/nykIhs12345"></iframe><p>', {
  allowedTags: [ 'p', 'em', 'strong', 'iframe' ],
  allowedClasses: {
    'p': [ 'fancy', 'simple' ],
  },
  allowedAttributes: {
    'iframe': ['src']
  },
  allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
});
```

will pass through as safe whereas:

```javascript
const clean = sanitizeHtml('<p><iframe src="https://www.youtube.net/embed/nykIhs12345"></iframe><p>', {
  allowedTags: [ 'p', 'em', 'strong', 'iframe' ],
  allowedClasses: {
    'p': [ 'fancy', 'simple' ],
  },
  allowedAttributes: {
    'iframe': ['src']
  },
  allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
});
```

or

```javascript
const clean = sanitizeHtml('<p><iframe src="https://www.vimeo/video/12345"></iframe><p>', {
  allowedTags: [ 'p', 'em', 'strong', 'iframe' ],
  allowedClasses: {
    'p': [ 'fancy', 'simple' ],
  },
  allowedAttributes: {
    'iframe': ['src']
  },
  allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
});
```

will return an empty iframe tag.

If you want to allow any subdomain of any level you can provide the domain in `allowedIframeDomains`

```javascript
// This iframe markup will pass through as safe.
const clean = sanitizeHtml('<p><iframe src="https://us02web.zoom.us/embed/12345"></iframe><p>', {
  allowedTags: [ 'p', 'em', 'strong', 'iframe' ],
  allowedClasses: {
    'p': [ 'fancy', 'simple' ],
  },
  allowedAttributes: {
    'iframe': ['src']
  },
  allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
  allowedIframeDomains: ['zoom.us']
});
```

### Script Filters

Similarly to iframes you can allow a script tag on a list of allowlisted domains

```js
const clean = sanitizeHtml('<script src="https://www.safe.authorized.com/lib.js"></script>', {
    allowedTags: ['script'],
    allowedAttributes: {
        script: ['src']
    },
    allowedScriptDomains: ['authorized.com'],
})
```

You can allow a script tag on a list of allowlisted hostnames too

```js
const clean = sanitizeHtml('<script src="https://www.authorized.com/lib.js"></script>', {
    allowedTags: ['script'],
    allowedAttributes: {
        script: ['src']
    },
    allowedScriptHostnames: [ 'www.authorized.com' ],
})
```

### Allowed URL schemes

By default, we allow the following URL schemes in cases where `href`, `src`, etc. are allowed:

```js
[ 'http', 'https', 'ftp', 'mailto' ]
```

You can override this if you want to:

```js
sanitizeHtml(
  // teeny-tiny valid transparent GIF in a data URL
  '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />',
  {
    allowedTags: [ 'img', 'p' ],
    allowedSchemes: [ 'data', 'http' ]
  }
);
```

You can also allow a scheme for a particular tag only:

```js
allowedSchemes: [ 'http', 'https' ],
allowedSchemesByTag: {
  img: [ 'data' ]
}
```

And you can forbid the use of protocol-relative URLs (starting with `//`) to access another site using the current protocol, which is allowed by default:

```js
allowProtocolRelative: false
```

### Discarding the entire contents of a disallowed tag

Normally, with a few exceptions, if a tag is not allowed, all of the text within it is preserved, and so are any allowed tags within it.

The exceptions are:

`style`, `script`, `textarea`, `option`

If you wish to replace this list, for instance to discard whatever is found
inside a `noscript` tag, use the `nonTextTags` option:

```js
nonTextTags: [ 'style', 'script', 'textarea', 'option', 'noscript' ]
```

Note that if you use this option you are responsible for stating the entire list. This gives you the power to retain the content of `textarea`, if you want to.

The content still gets escaped properly, with the exception of the `script` and
`style` tags. *Allowing either `script` or `style` leaves you open to XSS
attacks. Don't do that* unless you have good reason to trust their origin.
sanitize-html will log a warning if these tags are allowed, which can be
disabled with the `allowVulnerableTags: true` option.

### Choose what to do with disallowed tags

Instead of discarding, or keeping text only, you may enable escaping of the entire content:

```js
disallowedTagsMode: 'escape'
```

This will transform `<disallowed>content</disallowed>` to `&lt;disallowed&gt;content&lt;/disallowed&gt;`

Valid values are: `'discard'` (default), `'escape'` (escape the tag) and `'recursiveEscape'` (to escape the tag and all its content).

### Restricting deep nesting

You can limit the depth of HTML tags in the document with the `nestingLimit` option:

```javascript
nestingLimit: 6
```

This will prevent the user from nesting tags more than 6 levels deep. Tags deeper than that are stripped out exactly as if they were disallowed. Note that this means text is preserved in the usual ways where appropriate.

## About ApostropheCMS

sanitize-html was created at [P'unk Avenue](https://punkave.com) for use in [ApostropheCMS](https://apostrophecms.com), an open-source content management system built on Node.js. If you like sanitize-html you should definitely check out ApostropheCMS.

## Support

Feel free to open issues on [github](https://github.com/apostrophecms/sanitize-html).
