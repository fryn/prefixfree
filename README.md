# [-prefix-**free**](http://leaverou.github.com/prefixfree/)
## Break free from CSS prefix hell!

[Project homepage](http://leaverou.github.com/prefixfree/)

A script that lets you use only unprefixed CSS properties everywhere. 
It works behind the scenes, adding the current browser’s prefix to any CSS code, only when it’s needed.

## API Documentation
Note: To use -prefix-free you don't need to write any JS code, just to include prefixfree.js in your page.

Thie fork of -prefix-free creates no global variables.
It simply sets `navigator.prefix` to the detected prefix of the current browser (like `'-moz-'` or `'-webkit-'`).
