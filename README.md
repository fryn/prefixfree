# [-prefix-free](http://fryn.github.io/prefixfree/)
## Break free from CSS prefix hell!

-prefix-free lets you use only unprefixed CSS properties everywhere. 
It works behind the scenes, adding the current browser’s prefix to any CSS code, only when it’s needed.

To use -prefix-free, simply include prefixfree.min.js at the bottom of the `<body>` of your page. For example:
`<script src="prefixfree.min.js"></script>`

This fork exposes no global variables to keep things clean and simple, and it improves upon the already excellent original by providing automatic prefixing support for the following:
- external stylesheets (`<link>`),
- internal stylesheets (`<style>`),
- directly setting values of `style` attributes,
- getting/setting values of `anyElement.style.anyProperty`.

Known limitations in which -prefix-free cannot prefix CSS:
- setting values of `anyElement.style.cssText`,
- setting transform values of `anyElement.style.transition`/`transitionProperty`.
