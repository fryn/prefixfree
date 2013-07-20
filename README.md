# [-prefix-free](http://leaverou.github.io/prefixfree/)
## Write prefix-free code everywhere!

**-prefix-free** enables you to use only unprefixed CSS properties everywhere. 
It works behind the scenes, adding the current browser’s prefix to any CSS code, only when it’s needed.

To use **-prefix-free**, simply include `prefixfree.min.js` at the bottom of the `<body>` of your page. For example:
`<script src="prefixfree.min.js"></script>`

This is a remix of Lea Verou's excellent original.
It exposes no global variables to keep things simple and provides automatic prefixing support for the following:
- external `<link>` stylesheets,
- internal `<style>` stylesheets,
- getting/setting `element.style.property`/`getPropertyValue()`/`setProperty()`, etc.
