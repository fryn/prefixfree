/**
 * -prefix-free 1.0.7 (fryn remix) <https://github.com/fryn/prefixfree>
 * @author Lea Verou
 * @author Frank Yan
 * @license MIT license
 */

if (typeof addEventListener == 'function') ({
  initialize: function(exports) {
    var doc = document.implementation.createHTMLDocument('');
    var el = doc.documentElement.appendChild(doc.createElement('style'));
    var style = el.style;

    // Properties

    function decapitalize(str) {
      return str.replace(/^[A-Z]/, function($0) { return $0.toLowerCase(); });
    }

    var prefixes = {
      'Moz': 0,
      'webkit': 0,
      'ms': 0
    };

    this.properties = [];
    for (var property in style) {
      for (var pref in prefixes) {
        if (!property.indexOf(pref)) {
          var unprefixed = decapitalize(property.slice(pref.length));
          if (!(unprefixed in style))
            this.properties.push(unprefixed);
          ++prefixes[pref];
          break;
        }
      }
    }
    if (!this.properties.length)
      return;

    var prefix = Object.keys(prefixes).sort(function(a, b) {
      return prefixes[a] - prefixes[b];
    }).pop();
    exports['PrefixFree'] = {
      'JS': prefix,
      'CSS': this.prefix = prefix ? '-' + prefix.toLowerCase() + '-' : ''
    };

    // Properties that accept properties as their value
    this.valueProperties = [
      'transition',
      'transition-property'
    ];

    // Functions & Keywords

    function valueSupported(value, property) {
      style[property] = '';
      style[property] = value;

      return !!style[property];
    }

    // Values that might need prefixing
    var functions = {
      'linear-gradient': {
        property: 'backgroundImage',
        params: 'red, red'
      },
      'calc': {
        property: 'width',
        params: '0%'
      },
      'element': {
        property: 'backgroundImage',
        params: '#_'
      },
      'cross-fade': {
        property: 'backgroundImage',
        params: 'url(_), url(_), 0%'
      }
    };
    functions['repeating-linear-gradient'] =
    functions['repeating-radial-gradient'] =
    functions['radial-gradient'] =
    functions['linear-gradient'];

    this.functions = [];
    for (var fn in functions) {
      var test = functions[fn],
        property = test.property,
        value = fn + '(' + test.params + ')';

      if (!valueSupported(value, property)
          && valueSupported(this.prefix + value, property))
        this.functions.push(fn);
    }

    // Note: The properties assigned are just to *test* support. 
    // The keywords will be prefixed everywhere.
    var keywords = {
      'initial': 'color',
      'zoom-in': 'cursor',
      'zoom-out': 'cursor',
      'grab': 'cursor',
      'grabbing': 'cursor',
      'box': 'display',
      'flexbox': 'display',
      'inline-flexbox': 'display',
      'flex': 'display',
      'inline-flex': 'display',
      'grid': 'display',
      'inline-grid': 'display',
      'min-content': 'width'
    };

    this.keywords = [];
    for (var keyword in keywords) {
      var property = keywords[keyword];

      if (!valueSupported(keyword, property)
          && valueSupported(this.prefix + keyword, property))
        this.keywords.push(keyword);
    }

    // Selectors & At-rules

    function headerSupported(header) {
      el.textContent = header + '{}';

      return !!el.sheet.cssRules.length;
    }

    var selectors = {
      ':read-only': null,
      ':read-write': null,
      ':any-link': null,
      '::selection': null
    };

    this.selectors = [];
    for (var selector in selectors) {
      var test = selector + (selectors[selector] ? '(' + selectors[selector] + ')' : '');

      if (!headerSupported(test) && headerSupported(this._prefixSelector(test)))
        this.selectors.push(selector);
    }

    var atrules = {
      'keyframes': 'name',
      'viewport': null,
      'document': 'regexp(".")'
    };

    this.atrules = [];
    for (var atrule in atrules) {
      var test = atrule + ' ' + (atrules[atrule] || '');

      if (!headerSupported('@' + test) && headerSupported('@' + this.prefix + test)) {
        this.atrules.push(atrule);
      }
    }

    // Profit!

    this.process();

    function capitalize(str) {
      return str.replace(/^[a-z]/, function($0) { return $0.toUpperCase(); });
    }

    var that = this;

    if (typeof MutationObserver == 'function' ||
        typeof WebkitMutationObserver == 'function') {
      var target = document.documentElement;
      var config = {
        attributeFilter: ['style'],
        attributes: true,
        subtree: true
      };
      var observer = new (MutationObserver || WebkitMutationObserver)(function(mutations) {
        observer.disconnect();
        mutations.forEach(function(mutation) {
          that.styleAttribute(mutation.target);
        });
        observer.observe(target, config);
      });
      observer.observe(target, config);
    }

    this.properties.forEach(function(name) {
      Object.defineProperty(CSSStyleDeclaration.prototype, name, {
        get: function() {
          return this[prefix + capitalize(name)];
        },
        set: function(value) {
          observer && observer.disconnect();
          this[prefix + capitalize(name)] =
            that.keywords.indexOf(value) > -1 ? that.prefix + value :
              that.valueProperties.indexOf(name) > -1 ?
                that._fix('properties', '(^|,|\\s)', '(\\s|,|$)',
                          '$1' + that.prefix + '$2$3', value) : value;
          observer && observer.observe(target, config);
        }
      });
    });

    [
      'getPropertyPriority',
      'getPropertyValue',
      'removeProperty',
      'setProperty'
    ].forEach(function(fn) {
      var orig = CSSStyleDeclaration.prototype[fn];
      var hook = function(name, value, priority) {
        value = that.keywords.indexOf(value) > -1 ? that.prefix + value :
          that.valueProperties.indexOf(name) > -1 ?
            that._fix('properties', '(^|,|\\s)', '(\\s|,|$)',
                      '$1' + that.prefix + '$2$3', value) : value;
        name = that.properties.indexOf(name) > -1 ? that.prefix + name : name;
        return orig.call(this, name, value, priority);
      };
      hook.toString = hook.toString.bind(orig);
      CSSStyleDeclaration.prototype[fn] = hook;
    });
  },

  link: function(link) {
    var url = link.href,
        base = url.replace(/[^\/]+$/, ''),
        base_scheme = (/^[a-z]{3,10}:/.exec(base) || [''])[0],
        base_domain = (/^[a-z]{3,10}:\/\/[^\/]+/.exec(base) || [''])[0],
        base_query = /^([^?]*)\??/.exec(url)[1],
        parent = link.parentNode,
        fix = this.fix,
        xhr = new XMLHttpRequest(),
        process = function() {
      var css = xhr.responseText;

      if (css && link.parentNode &&
          (!xhr.status || xhr.status < 400 || xhr.status > 600)) {
        var fixed = fix(css, true);
        if (css == fixed)
          return;
        css = fixed;

        // Convert relative URLs to absolute, if needed
        if (base)
          css = css.replace(/url\(\s*?((?:"|')?)(.+?)\1\s*?\)/gi,
                            function($0, quote, url) {
            if (/^([a-z]{3,10}:|#)/i.test(url)) // Absolute & or hash-relative
              return $0;
            else if (/^\/\//.test(url)) // Scheme-relative
              // May contain sequences like /../ and /./ but those DO work
              return 'url("' + base_scheme + url + '")';
            else if (/^\//.test(url)) // Domain-relative
              return 'url("' + base_domain + url + '")';
            else if (/^\?/.test(url)) // Query-relative
              return 'url("' + base_query + url + '")';
            else // Path-relative
              return 'url("' + base + url + '")';
          });

        var style = document.createElement('style');
        style.textContent = css;
        style.media = link.media;
        style.disabled = link.disabled;
        style.setAttribute('data-href', link.getAttribute('href'));

        parent.insertBefore(style, link);
        parent.removeChild(link);

        style.media = link.media; // Duplicate is intentional. See issue #31
      }
    };
    xhr.onload = process;
    try {
      xhr.open('get', url);
    } catch (e) {
      try {
        xhr = new XDomainRequest();
        xhr.onerror = xhr.onprogress = xhr.ontimeout = function() {};
        xhr.onload = process;
      } catch (e) {
        return;
      }
    }
    xhr.send();
  },

  styleElement: function(style) {
    var disabled = style.disabled;

    var css = style.textContent;
    var fixed = this.fix(css, true);
    if (css != fixed)
      style.textContent = fixed;

    style.disabled = disabled;
  },

  styleAttribute: function(element) {
    var css = element.getAttribute('style');
    var fixed = this.fix(css, false);
    if (css != fixed)
      element.setAttribute('style', fixed);
  },

  process: function() {
    // Linked stylesheets
    this._forEach('link[rel=stylesheet]', this.link);

    // Inline stylesheets
    this._forEach('style', this.styleElement);

    // Inline styles
    this._forEach('[style]', this.styleAttribute);
  },

  _forEach: function(selector, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), fn, this);
  },

  fix: function(css, raw) {
    var prefix = this.prefix;

    // Gradient angles hotfix
    if (this.functions.indexOf('linear-gradient') > -1) {
      // Gradients are supported with a prefix, convert angles to legacy
      css = css.replace(/(\s|:|,)(repeating-)?linear-gradient\(\s*(-?\d*\.?\d*)deg/ig,
                        function ($0, delim, repeating, deg) {
        return delim + (repeating || '') + 'linear-gradient(' + (90-deg) + 'deg';
      });
    }

    css = this._fix('functions', '(\\s|:|,)', '\\s*\\(', '$1' + prefix + '$2(', css);
    css = this._fix('keywords', '(\\s|:)', '(\\s|;|\\}|$)', '$1' + prefix + '$2$3', css);
    css = this._fix('properties', '(^|\\{|\\s|;)', '\\s*:', '$1' + prefix + '$2:', css);

    // Prefix properties *inside* values (issue #8)
    var regex = RegExp('\\b(' + this.properties.join('|') + ')(?!:)', 'gi');
    css = this._fix('valueProperties', '\\b', ':(.+?);', function($0) {
      return $0.replace(regex, prefix + '$1');
    }, css);

    if (raw) {
      css = this._fix('selectors', '', '\\b', this._prefixSelector, css);
      css = this._fix('atrules', '@', '\\b', '@' + prefix + '$1', css);
    }

    // Fix double prefixing
    css = css.replace(RegExp('-' + prefix, 'g'), '-');

    return css;
  },

  _fix: function(what, before, after, replacement, css) {
    what = this[what];
    if (what.length) {
      var regex = RegExp(before + '(' + what.join('|') + ')' + after, 'gi');
      css = css.replace(regex, replacement);
    }
    return css;
  },

  _prefixSelector: function(selector) {
    var prefix = this.prefix;
    return selector.replace(/^:{1,2}/, function($0) { return $0 + prefix; });
  }
}).initialize({} /* replace with `this` to expose detected prefix as global */);
