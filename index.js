var htmlparser = require('htmlparser2');
var _ = require('lodash');
var ent = require('ent');

module.exports = sanitizeHtml;

function sanitizeHtml(html, options) {
  var result = '';
  if (!options) {
    options = sanitizeHtml.defaults;
  } else {
    _.defaults(options, sanitizeHtml.defaults);
  }
  // Tags that contain something other than HTML. If we are not allowing
  // these tags, we should drop their content too. For other tags you would
  // drop the tag but keep its content.
  var nonTextTagsMap = {
    script: true,
    style: true
  };
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
  var skipText = false;
  var parser = new htmlparser.Parser({
    onopentag: function(name, attribs) {
      var skip = false;
      if (!_.has(allowedTagsMap, name)) {
        skip = true;
        if (_.has(nonTextTagsMap, name)) {
          skipText = true;
        }
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
              // Values are ALREADY escaped, calling escapeHtml here
              // results in double escapes
              result += '="' + value + '"';
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
      if (skipText) {
        return;
      }
      // It is NOT actually raw text, entities are already escaped.
      // If we call escapeHtml here we wind up double-escaping.
      result += text;
    },
    onclosetag: function(name) {
      skipText = false;
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
    // So we don't get faked out by a hex or decimal escaped javascript URL #1
    href = ent.decode(href);
    // Browsers ignore character codes of 32 (space) and below in a surprising
    // number of situations. Start reading here:
    // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet#Embedded_tab
    href = href.replace(/[\x00-\x20]+/, '');
    // Case insensitive so we don't get faked out by JAVASCRIPT #1
    var matches = href.match(/^([a-zA-Z]+)\:/);
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
