# Changelog

## 2.17.0 (2025-05-14)

- Add `preserveEscapedAttributes`, allowing attributes on escaped disallowed tags to be retained. Thanks to [Ben Elliot](https://github.com/benelliott) for this new option.

## 2.16.0 (2025-04-16)

- Add `onOpenTag` and `onCloseTag` events to enable advanced filtering to hook into the parser. Thanks to [Rimvydas Naktinis](https://github.com/naktinis).

## 2.15.0 (2025-03-19)

- Allow keeping tag content when discarding with exclusive filter by returning `"excludeTag"`. Thanks to [rChaoz](https://github.com/rChaoz).

## 2.14.0 (2024-12-18)

- Fix adding text with `transformTags` in cases where it originally had no text child elements. Thanks to [f0x](https://cthu.lu).

## 2.13.1 (2024-10-03)

- Fix to allow regex in `allowedClasses` wildcard whitelist. Thanks to `anak-dev`.

## 2.13.0 (2024-03-20)

- Documentation update regarding minimum supported TypeScript version.

- Added disallowedTagsMode: `completelyDiscard` option to remove the content also in HTML. Thanks to [Gauav Kumar](https://github.com/gkumar9891) for this addition.

## 2.12.1 (2024-02-22)

- Do not parse sourcemaps in `post-css`. This fixes a vulnerability in which information about the existence or non-existence of files on a server could be disclosed via properly crafted HTML input when the `style` attribute is allowed by the configuration. Thanks to the [Snyk Security team](https://snyk.io/) for the disclosure and to [Dylan Armstrong](https://dylan.is/) for the fix.

## 2.12.0 (2024-02-21)

- Introduced the `allowedEmptyAttributes` option, enabling explicit specification of empty string values for select attributes, with the default attribute set to `alt`. Thanks to [Na](https://github.com/zhna123) for the contribution.

- Clarified the use of SVGs with a new test and changes to documentation. Thanks to [Gauav Kumar](https://github.com/gkumar9891) for the contribution.

- Do not process source maps when processing style tags with PostCSS.

## 2.11.0 (2023-06-21)

- Fix to allow `false` in `allowedClasses` attributes. Thanks to [Kevin Jiang](https://github.com/KevinSJ) for this fix!
- Upgrade mocha version
- Apply small linter fixes in tests
- Add `.idea` temp files to `.gitignore`
- Thanks to [Vitalii Shpital](https://github.com/VitaliiShpital) for the updates!
- Show parseStyleAttributes warning in browser only. Thanks to [mog422](https://github.com/mog422) for this update!
- Remove empty non-boolean attributes via an exhaustive, configurable list of known non-boolean attributes. [Thanks to Dylan Armstrong](https://github.com/dylanarmstrong) for this update!

## 2.10.0 (2023-02-17)

- Fix auto-adding escaped closing tags. In other words, do not add implied closing tags to disallowed tags when `disallowedTagMode` is set to any variant of `escape` -- just escape the disallowed tags that are present. This fixes [issue #464](https://github.com/apostrophecms/sanitize-html/issues/464). Thanks to [Daniel Liebner](https://github.com/dliebner)
- Add `tagAllowed()` helper function which takes a tag name and checks it against `options.allowedTags` and returns `true` if the tag is allowed and `false` if it is not.

## 2.9.0 (2023-01-27)

- Add option parseStyleAttributes to skip style parsing. This fixes [issue #547](https://github.com/apostrophecms/sanitize-html/issues/547). Thanks to [Bert Verhelst](https://github.com/bertyhell).

## 2.8.1 (2022-12-21)

- If the argument is a number, convert it to a string, for backwards compatibility. Thanks to [Alexander Schranz](https://github.com/alexander-schranz).

## 2.8.0 (2022-12-12)

- Upgrades `htmlparser2` to new major version `^8.0.0`. Thanks to [Kedar Chandrayan](https://github.com/kedarchandrayan) for this contribution.

## 2.7.3 (2022-10-24)

- If allowedTags is falsy but not exactly `false`, then do not assume that all tags are allowed. Rather, allow no tags in this case, to be on the safe side. This matches the existing documentation and fixes [issue #176](https://github.com/apostrophecms/sanitize-html/issues/176). Thanks to [Kedar Chandrayan](https://github.com/kedarchandrayan) for the fix.

## 2.7.2 (2022-09-15)

- Closing tags must agree with opening tags. This fixes [issue #549](https://github.com/apostrophecms/sanitize-html/issues/549), in which closing tags not associated with any permitted opening tag could be passed through. No known exploit exists, but it's better not to permit this. Thanks to 
[Kedar Chandrayan](https://github.com/kedarchandrayan) for the report and the fix.

## 2.7.1 (2022-07-20)

- Protocol-relative URLs are properly supported for script tags. Thanks to [paweljq](https://github.com/paweljq).
- A denial-of-service vulnerability has been fixed by replacing global regular expression replacement logic for comment removal with a new implementation. Thanks to Nariyoshi Chida of NTT Security Japan for pointing out the issue.

## 2.7.0 (2022-02-04)

- Allows a more sensible set of default attributes on `<img />` tags. Thanks to [Zade Viggers](https://github.com/zadeviggers).

## 2.6.1 (2021-12-08)

- Fixes style filtering to retain `!important` when used.
- Fixed trailing text bug on `transformTags` options that was reported on [issue #506](https://github.com/apostrophecms/sanitize-html/issues/506). Thanks to [Alex Rantos](https://github.com/alex-rantos).

## 2.6.0 (2021-11-23)

- Support for regular expressions in the `allowedClasses` option. Thanks to [Alex Rantos](https://github.com/alex-rantos).

## 2.5.3 (2021-11-02):

- Fixed bug introduced by klona 2.0.5, by removing klona entirely.

## 2.5.2 (2021-10-13):

- Nullish HTML input now returns an empty string. Nullish value may be explicit `null`, `undefined` or implicit `undefined` when value is not provided. Thanks to Artem Kostiuk for the contribution.
- Documented that all text content is escaped. Thanks to Siddharth Singh.

## 2.5.1 (2021-09-14):
- The `allowedScriptHostnames` and `allowedScriptDomains` options now implicitly purge the inline content of all script tags, not just those with `src` attributes. This behavior was already strongly implied by the fact that they purged it in the case where a `src` attribute was actually present, and is necessary for the feature to provide any real security. Thanks to Grigorii Duca for pointing out the issue.

## 2.5.0 (2021-09-08):

- New `allowedScriptHostnames` option, it enables you to specify which hostnames are allowed in a script tag.
- New `allowedScriptDomains` option, it enables you to specify which domains are allowed in a script tag. Thank you to [Yorick Girard](https://github.com/yorickgirard) for this and the `allowedScriptHostnames` contribution.
- Updates whitelist to allowlist.

## 2.4.0 (2021-05-19):
- Added support for class names with wildcards in `allowedClasses`. Thanks to [zhangbenber](https://github.com/zhangbenber) for the contribution.

## 2.3.3 (2021-03-19):
- Security fix: `allowedSchemes` and related options did not properly block schemes containing a hyphen, plus sign, period or digit, such as `ms-calculator:`. Thanks to Lukas Euler for pointing out the issue.
- Added a security note about the known risks associated with using the `parser` option, especially `decodeEntities: false`. See the documentation.

## 2.3.2 (2021-01-26):

- Additional fixes for iframe validation exploits. Prevent exploits based on browsers' tolerance of the use of "\" rather than "/" and the presence of whitespace at this point in the URL. Thanks to Ron Masas of [Checkmarx](https://www.checkmarx.com/) for pointing out the issue and writing unit tests.
- Updates README `yarn add` syntax. Thanks to [Tagir Khadshiev](https://github.com/Aspedm) for the contribution.

## 2.3.1 (2021-01-22):
- Uses the standard WHATWG URL parser to stop IDNA (Internationalized Domain Name) attacks on the iframe hostname validator. Thanks to Ron Masas of [Checkmarx](https://www.checkmarx.com/) for pointing out the issue and suggesting the use of the WHATWG parser.

## 2.3.0 (2020-12-16):
- Upgrades `htmlparser2` to new major version `^6.0.0`. Thanks to [Bogdan Chadkin](https://github.com/TrySound) for the contribution.

## 2.2.0 (2020-12-02):
- Adds a note to the README about Typescript support (or the lack-thereof).
- Adds `tel` to the default `allowedSchemes`. Thanks to [Arne Herbots](https://github.com/aHerbots) for this contribution.

## 2.1.2 (2020-11-04):
- Fixes typos and inconsistencies in the README. Thanks to [Eric Lefevre-Ardant](https://github.com/elefevre) for this contribution.

## 2.1.1 (2020-10-21):
- Fixes a bug when using `allowedClasses` with an `'*'` wildcard selector. Thanks to [Clemens Damke](https://github.com/Cortys) for this contribution.
- Updates mocha to 7.x to resolve security warnings.

## 2.1.0 (2020-10-07):
- `sup` added to the default allowed tags list. Thanks to [Julian Lam](https://github.com/julianlam) for the contribution.
- Updates default `allowedTags` README documentation. Thanks to [Marco Arduini](https://github.com/nerfologist) for the contribution.

## 2.0.0 (2020-09-23):
- `nestingLimit` option added.
- Updates ESLint config package and fixes warnings.
- Upgrade `is-plain-object` package with named export. Thanks to [Bogdan Chadkin](https://github.com/TrySound) for the contribution.
- Upgrade `postcss` package and drop Node 11 and Node 13 support (enforced by postcss).

### Backwards compatibility breaks:
- There is no build. You should no longer directly link to a sanitize-html file directly in the browser as it is using modern Javascript that is not fully supported by all major browsers (depending on your definition). You should now include sanitize-html in your project build for this purpose if you have one.
- On the server side, Node.js 10 or higher is required.
- The default `allowedTags` array was updated significantly. This mostly added HTML tags to be more comprehensive by default. You should review your projects and consider the `allowedTags` defaults if you are not already overriding them.

## 2.0.0-rc.2 (2020-09-09):
- Always use existing `has` function rather than duplicating it.

## 2.0.0-rc.1 (2020-08-26):
- Upgrade `klona` package. Thanks to [Bogdan Chadkin](https://github.com/TrySound) for the contribution.

## 2.0.0-beta.2:
- Add `files` to `package.json` to prevent publishing unnecessary files to npm #392. Thanks to [styfle](https://github.com/styfle) for the contribution.
- Removes `iframe` and `nl` from default allowed tags. Adds most innocuous tags to the default `allowedTags` array.
- Fixes a bug when using `transformTags` with out `textFilter`. Thanks to [Andrzej Porebski](https://github.com/andpor) for the help with a failing test.

## 2.0.0-beta:
- Moves the `index.js` file to the project root and removes all build steps within the package. Going forward, it is up to the developer to include sanitize-html in their project builds as-needed. This removes major points of conflict with project code and frees this module to not worry about myriad build-related questions.
- Replaces lodash with utility packages: klona, is-plain-object, deepmerge, escape-string-regexp.
- Makes custom tag transformations less error-prone by escaping frame `innerText`. Thanks to [Mike Samuel](https://github.com/mikesamuel) for the contribution. Prior to this patch, tag transformations which turned an attribute
value into a text node could be vulnerable to code execution.
- Updates code to use modern features including `const`/`let` variable assignment.
- ESLint clean up.
- Updates `is-plain-object` to the 4.x major version.
- Updates `srcset` to the 3.x major version.

Thanks to [Bogdan Chadkin](https://github.com/TrySound) for contributions to this major version update.

## 1.27.5 (2020-09-23):
- Updates README to include ES modules syntax.

## 1.27.4 (2020-08-26):
- Fixes an IE11 regression from using `Array.prototype.includes`, replacing it with `Array.prototype.indexOf`.

## 1.27.3 (2020-08-12):
- Fixes a bug when using `transformTags` with out `textFilter`. Thanks to [Andrzej Porebski](https://github.com/andpor) for the help with a failing test.

## 1.27.2 (2020-07-29):
- Fixes CHANGELOG links. Thanks to [Alex Mayer](https://github.com/amayer5125) for the contribution.
- Replaces `srcset` with `parse-srcset`. Thanks to [Massimiliano Mirra](https://github.com/bard) for the contribution.

## 1.27.1 (2020-07-15):
- Removes the unused chalk dependency.
- Adds configuration for a Github stale bot.
- Replace `xtend` package with native `Object.assign`.

## 1.27.0:
- Adds the `allowedIframeDomains` option. This works similar to `allowedIframeHostnames`, where you would set it to an array of web domains. It would then permit any hostname on those domains to be used in iframe `src` attributes. Thanks to [Stanislav Kravchenko](https://github.com/StanisLove) for the contribution.

## 1.26.0:
- Adds the `option` element to the default `nonTextTagsArray` of tags with contents that aren't meant to be displayed visually as text. This can be overridden with the `nonTextTags` option.

## 1.25.0:
- Adds `enforceHtmlBoundary` option to process code bounded by the `html` tag, discarding any code outside of those tags.
- Migrates to the main lodash package from the per method packages since they are deprecated and cause code duplication. Thanks to [Merceyz](https://github.com/merceyz) for the contribution.
- Adds a warning when `style` and `script` tags are allowed, as they are inherently vulnerable to being used in XSS attacks. That warning can be disabled by including the option `allowVulnerableTags: true` so this choice is knowing and explicit.

## 1.24.0:
- Fixes a bug where self-closing tags resulted in deletion with `disallowedTagsMode: 'escape'` set. Thanks to [Thiago Negri](https://github.com/thiago-negri) for the contribution.
- Adds `abbr` to the default `allowedTags` for better accessibility support. Thanks to [Will Farrell](https://github.com/willfarrell) for the contribution.
- Adds a `mediaChildren` property to the `frame` object in custom filters. This allows you to check for links or other parent tags that contain self-contained media to prevent collapse, regardless of whether there is also text inside. Thanks to [axdg](https://github.com/axdg) for the initial implementation and [Marco Arduini](https://github.com/nerfologist) for a failing test contribution.

## 1.23.0:
- Adds eslint configuration and adds eslint to test script.
- Sets `sideEffects: false` on package.json to allow module bundlers like webpack tree-shake this module and all the dependencies from client build. Thanks to [Egor Voronov](https://github.com/egorvoronov) for the contribution.
- Adds the `tagName` (HTML element name) as a second parameter passed to `textFilter`. Thanks to [Slava](https://github.com/slavaGanzin) for the contribution.

## 1.22.1:
ncreases the patch version of `lodash.mergewith` to enforce an audit fix.

## 1.22.0:
bumped `htmlparser2` dependency to the 4.x series. This fixes longstanding bugs and should cause no bc breaks for this module, since the only bc breaks upstream are in regard to features we don't expose in this module.

## 1.21.1:
fixed issue with bad `main` setting in package.json that broke 1.21.0.

## 1.21.0:
new `disallowedTagsMode` option can be set to `escape` to escape disallowed tags rather than discarding them. Any subtags are handled as usual. If you want to recursively escape them too, you can set `disallowedTagsMode` to `recursiveEscape`. Thanks to Yehonatan Zecharia for this contribution.

## 1.20.1:
Fix failing tests, add CircleCI config

## 1.20.0:
reduced size of npm package via the `files` key; we only need to publish what's in `dist`. Thanks to Steven. There should be zero impact on behavior, minor version bump is precautionary.

## 1.19.3:
reverted to `postcss` due to a [reported issue with `css-tree` that might or might not have XSS implications](https://github.com/punkave/sanitize-html/issues/269).

## 1.19.2:

* Switched out the heavy `postcss` dependency for the lightweight `css-tree` module. No API changes. Thanks to Justin Braithwaite.
* Various doc updates. Thanks to Pulkit Aggarwal and Cody Robertson.

## 1.19.1:

* `"` characters are now entity-escaped only when they appear in attribute values, reducing the verbosity of the resulting markup.

* Fixed a regression introduced in version 1.18.5 in the handling of markup that looks similar to a valid entity, but isn't. The bogus entity was passed through intact, i.e. `&0;` did not become `&amp;0;` as it should have. This fix has been made for the default parser settings only. There is no fix yet for those who wish to enable `decodeEntities: false`. That will require improving the alternative encoder in the `escapeHtml` function to only pass 100% valid entities.

**For those using the default `parser` settings this bug is fixed.** Read on if you are using alternative `parser` settings.

When `decodeEntities: true` is in effect (the default), this is not a problem because we only have to encode `& < > "` and we always encode those things.

There is currently a commented-out test which verifies one example of the problem when `decodeEntities` is false. However a correct implementation would need to not only pass that simple example but correctly escape all invalid entities, and not escape those that are valid.

## 1.19.0:

* New `allowIframeRelativeUrls` option. It defaults to `true` unless `allowedIframeHostnames` is present, in which case it defaults to false, for backwards compatibility with existing behavior in both cases; however you can now set the option explicitly to allow both certain hostnames and relative URLs. Thanks to Rick Martin.

## 1.18.5:

* Stop double encoding ampersands on HTML entities. Thanks to Will Gibson.

## 1.18.4:

* Removed incorrect `browser` key, restoring frontend build. Thanks to Felix Becker.

## 1.18.3:

* `iframe` is an allowed tag by default, to better facilitate typical use cases and the use of the `allowedIframeHostnames` option.
* Documentation improvements.
* More browser packaging improvements.
* Protocol-relative URLs are properly supported for iframe tags.

## 1.18.2:

* Travis tests passing.
* Fixed another case issue — and instituted Travis CI testing so this doesn't happen again. Sorry for the hassle.

## 1.18.1:

* A file was required with incorrect case, breaking the library on case sensitive filesystems such as Linux. Fixed.

## 1.18.0:

* The new `allowedSchemesAppliedToAttributes` option. This determines which attributes are validated as URLs, replacing the old hardcoded list of `src` and `href` only. The default list now includes `cite`. Thanks to ml-dublin for this contribution.
* It is now easy to configure a specific list of allowed values for an attribute. When configuring `allowedAttributes`, rather than listing an attribute name, simply list an object with an attribute `name` property and an allowed `values` array property. You can also add `multiple: true` to allow multiple space-separated allowed values in the attribute, otherwise the attribute must match one and only one of the allowed values. Thanks again to ml-dublin for this contribution.
* Fixed a bug in the npm test procedure.

## 1.17.0:
The new `allowedIframeHostnames` option. If present, this must be an array, and only iframe `src` URLs hostnames (complete hostnames; domain name matches are not enough) that appear on this list are allowed. You must also configure `hostname` as an allowed attribute for `iframe`. Thanks to Ryan Verys for this contribution.

## 1.16.3:
Don't throw away the browserified versions before publishing them. `prepare` is not a good place to `make clean`, it runs after `prepublish`.

## 1.16.2:
`sanitize-html` is now compiled with `babel`. An npm `prepublish` script takes care of this at `npm publish` time, so the latest code should always be compiled to operate all the way back to ES5 browsers and earlier versions of Node. Thanks to Ayushya Jaiswal.

Please note that running `sanitize-html` in the browser is usually a security hole. Are you trusting the browser? Anyone could bypass that using the network panel. Sanitization is almost always best done on servers and that is the primary use case for this module.

## 1.16.1:
changelog formatting only.

## 1.16.0:
support for sanitizing inline CSS styles, by specifying the allowed attributes and a regular expression for each. Thanks to Cameron Will and Michael Loschiavo.

## 1.15.0:
if configured as an allowed attribute (not the default), check for naughty URLs in `srcset` attributes. Thanks to Mike Samuel for the nudge to do this and to Sindre Sorhus for the `srcset` module.

## 1.14.3:
inadvertent removal of lodash regexp quote dependency in 1.14.2 has been corrected.

## 1.14.2:
protocol-relative URL detection must spot URLs starting with `\\` rather than `//` due to ages-old tolerance features of web browsers, intended for sleepy Windows developers. Thanks to Martin Bajanik.

## 1.14.1:
documented `allowProtocolRelative` option. No code changes from 1.14.0, released a few moments ago.

## 1.14.0:
the new `allowProtocolRelative` option, which is set to `true` by default, allows you to decline to accept URLs that start with `//` and thus point to a different host using the current protocol. If you do **not** want to permit this, set this option to `false`. This is fully backwards compatible because the default behavior is to allow them. Thanks to Luke Bernard.

## 1.13.0:
`transformTags` can now add text to an element that initially had none. Thanks to Dushyant Singh.

## 1.12.0:
option to build for browser-side use. Thanks to Michael Blum.

## 1.11.4:
fixed crash when `__proto__` is a tag name. Now using a safe check for the existence of properties in all cases. Thanks to Andrew Krasichkov.

Fixed XSS attack vector via `textarea` tags (when explicitly allowed). Decided that `script` (obviously) and `style` (due to its own XSS vectors) cannot realistically be afforded any XSS protection if allowed, unless we add a full CSS parser. Thanks again to Andrew Krasichkov.

## 1.11.3:
bumped `htmlparser2` version to address crashing bug in older version. Thanks to e-jigsaw.

## 1.11.2:
fixed README typo that interfered with readability due to markdown issues. No code changes. Thanks to Mikael Korpela. Also improved code block highlighting in README. Thanks to Alex Siman.

## 1.11.1:
fixed a regression introduced in 1.11.0 which caused the closing tag of the parent of a `textarea` tag to be lost. Thanks to Stefano Sala, who contributed the missing test.

## 1.11.0:
added the `nonTextTags` option, with tests.

## 1.10.1:
documentation cleanup. No code changes. Thanks to Rex Schrader.

## 1.10.0:
`allowedAttributes` now allows you to allow attributes for all tags by specifying `*` as the tag name. Thanks to Zdravko Georgiev.

## 1.9.0:
`parser` option allows options to be passed directly to `htmlparser`. Thanks to Danny Scott.

## 1.8.0:

* `transformTags` now accepts the `*` wildcard to transform all tags. Thanks to Jamy Timmermans.

* Text that has been modified by `transformTags` is then passed through `textFilter`. Thanks to Pavlo Yurichuk.

* Content inside `textarea` is discarded if `textarea` is not allowed. I don't know why it took me this long to see that this is just common sense. Thanks to David Frank.

## 1.7.2:
removed `array-includes` dependency in favor of `indexOf`, which is a little more verbose but slightly faster and doesn't require a shim. Thanks again to Joseph Dykstra.

## 1.7.1:
removed lodash dependency, adding lighter dependencies and polyfills in its place. Thanks to Joseph Dykstra.

## 1.7.0:
introduced `allowedSchemesByTag` option. Thanks to Cameron Will.

## 1.6.1:
the string `'undefined'` (as opposed to `undefined`) is perfectly valid text and shouldn't be expressly converted to the empty string.

## 1.6.0:
added `textFilter` option. Thanks to Csaba Palfi.

## 1.5.3:
do not escape special characters inside a script or style element, if they are allowed. This is consistent with the way browsers parse them; nothing closes them except the appropriate closing tag for the entire element. Of course, this only comes into play if you actually choose to allow those tags. Thanks to aletorrado.

## 1.5.2:
guard checks for allowed attributes correctly to avoid an undefined property error. Thanks to Zeke.

## 1.5.1:
updated to htmlparser2 1.8.x. Started using the `decodeEntities` option, which allows us to pass our filter evasion tests without the need to recursively invoke the filter.

## 1.5.0:
support for `*` wildcards in allowedAttributes. With tests. Thanks to Calvin Montgomery.

## 1.4.3:
invokes itself recursively until the markup stops changing to guard against [this issue](https://github.com/fb55/htmlparser2/issues/105). Bump to htmlparser2 version 3.7.x.

## 1.4.1, 1.4.2:
more tests.

## 1.4.0:
ability to  allow all attributes or tags through by setting `allowedAttributes` and/or `allowedTags` to false. Thanks to Anand Thakker.

## 1.3.0:
`attribs` now available on frames passed to exclusive filter.

## 1.2.3:
fixed another possible XSS attack vector; no definitive exploit was found but it looks possible. [See this issue.](https://github.com/punkave/sanitize-html/pull/20) Thanks to Jim O'Brien.

## 1.2.2:
reject `javascript:` URLs when disguised with an internal comment. This is probably not respected by browsers anyway except when inside an XML data island element, which you almost certainly are not allowing in your `allowedTags`, but we aim to be thorough. Thanks to Jim O'Brien.

## 1.2.1:
fixed crashing bug when presented with bad markup. The bug was in the `exclusiveFilter` mechanism. Unit test added. Thanks to Ilya Kantor for catching it.

## 1.2.0:
* The `allowedClasses` option now allows you to permit CSS classes in a fine-grained way.

* Text passed to your `exclusiveFilter` function now includes the text of child elements, making it more useful for identifying elements that truly lack any inner text.

## 1.1.7:
use `he` for entity decoding, because it is more actively maintained.

## 1.1.6:
`allowedSchemes` option for those who want to permit `data` URLs and such.

## 1.1.5:
just a packaging thing.

## 1.1.4:
custom exclusion filter.

## 1.1.3:
moved to lodash. 1.1.2 pointed to the wrong version of lodash.

## 1.1.0:
the `transformTags` option was added. Thanks to [kl3ryk](https://github.com/kl3ryk).

## 1.0.3:
fixed several more javascript URL attack vectors after [studying the XSS filter evasion cheat sheet](https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet) to better understand my enemy. Whitespace characters (codes from 0 to 32), which browsers ignore in URLs in certain cases allowing the "javascript" scheme to be snuck in, are now stripped out when checking for naughty URLs. Thanks again to [pinpickle](https://github.com/pinpickle).

## 1.0.2:
fixed a javascript URL attack vector. naughtyHref must entity-decode URLs and also check for mixed-case scheme names. Thanks to [pinpickle](https://github.com/pinpickle).

## 1.0.1:
Doc tweaks.

## 1.0.0:
If the style tag is disallowed, then its content should be dumped, so that it doesn't appear as text. We were already doing this for script tags, however in both cases the content is now preserved if the tag is explicitly allowed.

We're rocking our tests and have been working great in production for months, so: declared 1.0.0 stable.

## 0.1.3:
do not double-escape entities in attributes or text. Turns out the "text" provided by htmlparser2 is already escaped.

## 0.1.2:
packaging error meant it wouldn't install properly.

## 0.1.1:
discard the text of script tags.

## 0.1.0:
initial release.
