"use strict";
/**
 * Manual test run
 */
exports.__esModule = true;
var src_1 = require("./src");
var runConfig = {
    files: [
        'test-input.tsx',
    ],
    tags: src_1.defaultTags,
    output: function () { return './test-output.md'; }
};
src_1["default"](runConfig);
