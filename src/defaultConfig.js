"use strict";
/**
 * Default defined tags
 */
exports.__esModule = true;
exports.defaultTags = void 0;
var utils_1 = require("./utils");
exports.defaultTags = [
    {
        tag: "Title",
        render: function (tagData) {
            var hash = '#';
            // Turn alias in amount of hashes
            if (Number.isInteger(+tagData.alias)) {
                hash = Array(+tagData.alias).fill(null).join('#') + '#';
            }
            return utils_1.arrToDoc(hash + " " + (tagData.description || tagData.content), tagData.content || undefined, '');
        }
    },
    {
        tag: "Usage",
        render: function (tagData) { return utils_1.arrToDoc('## Usage', tagData.description || '', '\`\`\`', tagData.content, '\`\`\`', ''); }
    },
    {
        tag: "Title2",
        render: function (tagData) { return utils_1.arrToDoc("## " + (tagData.description || tagData.content), tagData.content || undefined, ''); }
    },
    {
        tag: "Title3",
        render: function (tagData) { return utils_1.arrToDoc("### " + (tagData.description || tagData.content), tagData.content || undefined, ''); }
    },
    {
        tag: "Title4",
        render: function (tagData) { return utils_1.arrToDoc("#### " + (tagData.description || tagData.content), tagData.content || undefined, ''); }
    },
    {
        tag: "Title5",
        render: function (tagData) { return utils_1.arrToDoc("##### " + (tagData.description || tagData.content), tagData.content || undefined, ''); }
    },
    {
        tag: "Title6",
        render: function (tagData) { return utils_1.arrToDoc("###### " + (tagData.description || tagData.content), tagData.content || undefined, ''); }
    },
    {
        tag: "Default",
        render: function (tagData) { return utils_1.arrToDoc("" + (tagData.description || tagData.content), tagData.content || undefined, ''); }
    },
    {
        tag: "Bold",
        render: function (tagData) { return utils_1.arrToDoc("**" + (tagData.description || tagData.content) + "**", ''); }
    },
    {
        tag: "Italic",
        render: function (tagData) { return utils_1.arrToDoc("*" + (tagData.description || tagData.content) + "*", ''); }
    },
    {
        tag: "Crossover",
        render: function (tagData) { return utils_1.arrToDoc("~~" + (tagData.description || tagData.content) + "~~", ''); }
    },
    {
        tag: "Img",
        render: function (tagData) {
            var _a, _b;
            return utils_1.arrToDoc(tagData.description, tagData.description ? '' : undefined, "![" + (((_a = tagData.extras) === null || _a === void 0 ? void 0 : _a[1]) || '') + "](" + ((_b = tagData.extras) === null || _b === void 0 ? void 0 : _b[0]) + ")", '');
        }
    },
    {
        tag: "Image",
        render: function (tagData) {
            var _a, _b;
            return utils_1.arrToDoc(tagData.description, tagData.description ? '' : undefined, "![" + (((_a = tagData.extras) === null || _a === void 0 ? void 0 : _a[1]) || '') + "](" + ((_b = tagData.extras) === null || _b === void 0 ? void 0 : _b[0]) + ")", '');
        }
    },
    {
        tag: "Quote",
        render: function (tagData) { return utils_1.arrToDoc(tagData.content ? tagData.description : undefined, "> " + (!tagData.content ? tagData.description : tagData.content), tagData.content ? '' : undefined); }
    },
    {
        tag: "Code",
        render: function (tagData) { return utils_1.arrToDoc("```" + tagData.type, tagData.content, '\`\`\`', ''); }
    },
    {
        tag: "X"
    },
    {
        tag: "Table",
        children: [
            {
                tag: "Column",
                children: [
                    {
                        tag: "Subcol"
                    },
                    {
                        tag: "Subcol2"
                    }
                ]
            }
        ]
    }
];
