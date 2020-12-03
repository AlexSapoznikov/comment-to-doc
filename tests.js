"use strict";
/**
 * Manual test run
 */
exports.__esModule = true;
var src_1 = require("./src");
var runConfig = {
    files: [
        'tests-input.tsx',
    ],
    tags: src_1.defaultTags,
    output: function () { return './tests-output.md'; }
};
src_1["default"](runConfig);
