# [-prefix-free](http://fryn.github.io/prefixfree/)
## Break free from CSS prefix hell!

-prefix-free lets you use only unprefixed CSS properties everywhere. 
It works behind the scenes, adding the current browser’s prefix to any CSS code, only when it’s needed.

To use -prefix-free, simply include prefixfree.min.js at the bottom of the `<body>` of your page. For example:
`<script src="prefixfree.min.js"></script>`

This fork exposes no global variables to keep things clean and simple, and it improves upon the already excellent original by providing automatic prefixing support for the following:
- external `<link>` stylesheets,
- internal `<style>` stylesheets,
- directly setting `style` attribute values,
- getting/setting `element.style.property`/`getPropertyValue()`/`setProperty()`.

Known limitation: -prefix-free cannot automatically prefix CSS when assigning to `element.style.cssText`.
