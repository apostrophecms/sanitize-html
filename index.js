var htmlparser = require('htmlparser2');
var _ = require('lodash');

module.exports = sanitizeHtml;

function sanitizeHtml(html, options) {
  var result = '';
  if (!options) {
    options = sanitizeHtml.defaults;
  } else {
    _.defaults(options, sanitizeHtml.defaults);
  }
  var allowedTagsMap = {};
  _.each(options.allowedTags, function(tag) {
    allowedTagsMap[tag] = true;
  });
  var selfClosingMap = {};
  _.each(options.selfClosing, function(tag) {
    selfClosingMap[tag] = true;
  });
  var allowedAttributesMap = {};
  _.each(options.allowedAttributes, function(attributes, tag) {
    allowedAttributesMap[tag] = {};
    _.each(attributes, function(name) {
      allowedAttributesMap[tag][name] = true;
    });
  });
  var depth = 0;
  var skipMap = {};
  var parser = new htmlparser.Parser({
    onopentag: function(name, attribs) {
      var skip = false;
      if (!_.has(allowedTagsMap, name)) {
        skip = true;
        skipMap[depth] = true;
      }
      depth++;
      if (skip) {
        // We want the contents but not this tag
        return;
      }
      result += '<' + name;
      if (_.has(allowedAttributesMap, name)) {
        _.each(attribs, function(value, a) {
          if (_.has(allowedAttributesMap[name], a)) {
            result += ' ' + a;
            if ((a === 'href') || (a === 'src')) {
              if (naughtyHref(value)) {
                return;
              }
            }
            if (value.length) {
              result += '="' + escapeHtml(value) + '"';
            }
          }
        });
      }
      if (_.has(selfClosingMap, name)) {
        result += " />";
      } else {
        result += ">";
      }
    },
    ontext: function(text) {
      result += escapeHtml(text);
    },
    onclosetag: function(name) {
      depth--;
      if (skipMap[depth]) {
        delete skipMap[depth];
        return;
      }
      if (_.has(selfClosingMap, name)) {
        // Already output />
        return;
      }
      result += "</" + name + ">";
    }
  });
  parser.write(html);
  parser.end();
  return result;

  function escapeHtml(s) {
    if (s === 'undefined') {
      s = '';
    }
    if (typeof(s) !== 'string') {
      s = s + '';
    }
    return s.replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/\>/g, '&gt;').replace(/\"/g, '&quot;');
  }

  function naughtyHref(href) {
    var matches = href.match(/^([a-z]+)\:/);
    if (!matches) {
      // No scheme = no way to inject js (right?)
      return false;
    }
    var scheme = matches[1].toLowerCase();
    return (!_.contains(['http', 'https', 'ftp', 'mailto' ], scheme));
  }
}

// Defaults are accessible to you so that you can use them as a starting point
// programmatically if you wish

sanitizeHtml.defaults = {
  allowedTags: [ 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div', 'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre' ],
  allowedAttributes: {
    a: [ 'href', 'name', 'target' ],
    // We don't currently allow img itself by default, but this
    // would make sense if we did
    img: [ 'src' ]
  },
  // Lots of these won't come up by default because we don't allow them
  selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ]
};
