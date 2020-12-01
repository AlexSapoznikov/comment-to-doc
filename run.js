"use strict";
/**
 * Test run
 */
exports.__esModule = true;
var defaultConfig_1 = require("./src/defaultConfig");
var src_1 = require("./src");
var runConfig = {
    files: [
        'run.tsx',
    ],
    tags: defaultConfig_1.defaultTags,
    output: function () { return './run.md'; }
};
src_1["default"](runConfig);
