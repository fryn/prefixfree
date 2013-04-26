# [refix](http://fryn.github.io/refix/)
## Write prefix-free code everywhere!

**refix** enables you to use only unprefixed CSS properties everywhere. 
It works behind the scenes, adding the current browser’s prefix to any CSS code, only when it’s needed.

To use **refix**, simply include `refix.min.js` at the bottom of the `<body>` of your page. For example:
`<script src="refix.min.js"></script>`

**refix** is a remix of Lea Verou's excellent **-prefix-free**.
It exposes no global variables to keep things simple and provides automatic prefixing support for the following:
- external `<link>` stylesheets,
- internal `<style>` stylesheets,
- getting/setting `element.style.property`/`getPropertyValue()`/`setProperty()`, etc.
