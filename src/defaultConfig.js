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
        tag: "Description",
        render: function (tagData) { return utils_1.arrToDoc('## Description', [tagData.description, tagData.content].filter(function (exists) { return exists; }).join('\n'), ''); }
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
        tag: "Custom",
        render: function (tagData) { return utils_1.arrToDoc(tagData.description, tagData.content, tagData.content ? '' : undefined); }
    },
    {
        tag: "Date",
        render: function (tagData) { return utils_1.arrToDoc(tagData.description, (new Date()).toISOString().slice(0, 19).replace('T', ' '), ''); }
    },
    {
        tag: "Table",
        children: [
            {
                tag: "Column"
            }
        ],
        render: function (tagData) {
            var _a, _b, _c, _d;
            console.log(tagData);
            // Table name
            var tableName = [tagData.description, tagData.content]
                .filter(function (exists) { return exists; })
                .join(' ') || '';
            var getColumnContent = function (column) {
                var _a, _b;
                return ((_b = (_a = [column.description, column.content]) === null || _a === void 0 ? void 0 : _a.filter(function (exists) { return exists; })) === null || _b === void 0 ? void 0 : _b.join(' ')) || ' ';
            };
            // Row separator
            var createSeparator = function (columnIndex) {
                var _a;
                var header = tagData.extras[columnIndex];
                var children = tagData === null || tagData === void 0 ? void 0 : tagData.children.filter(function (_, childIndex) {
                    var _a, _b;
                    console.log(childIndex, (childIndex % ((_a = tagData.extras) === null || _a === void 0 ? void 0 : _a.length)), getColumnContent(_));
                    return (childIndex === (childIndex % ((_b = tagData.extras) === null || _b === void 0 ? void 0 : _b.length)));
                });
                console.log('children', children);
                var longestChild = (_a = children === null || children === void 0 ? void 0 : children.sort(function (a, b) { return getColumnContent(b).length - getColumnContent(a).length; })) === null || _a === void 0 ? void 0 : _a[0];
                var longestValue = header.length >= getColumnContent(longestChild).length
                    ? header
                    : getColumnContent(longestChild);
                return longestValue.replace(/./gim, '-');
            };
            // Columns
            var columns = (_a = tagData.children) === null || _a === void 0 ? void 0 : _a.reduce(function (all, _, columnIndex) {
                var _a, _b, _c, _d;
                var scope = (_a = tagData.children) === null || _a === void 0 ? void 0 : _a.slice(columnIndex, (_b = tagData.children) === null || _b === void 0 ? void 0 : _b.length);
                var foundChild = scope
                    .find(function (child) { var _a, _b; return child.tag === 'Column' && ((_a = child.extras) === null || _a === void 0 ? void 0 : _a[0]) === tagData.extras[columnIndex % ((_b = tagData.extras) === null || _b === void 0 ? void 0 : _b.length)]; });
                var foundChildContent = getColumnContent(foundChild);
                // Add column
                all = all + foundChildContent;
                if (columnIndex % ((_c = tagData.extras) === null || _c === void 0 ? void 0 : _c.length) < ((_d = tagData.extras) === null || _d === void 0 ? void 0 : _d.length) - 1) {
                    // Add column wall
                    all = all + ' | ';
                }
                else {
                    // One row full, add separator
                    all = all + '\n';
                }
                return all;
            }, '');
            createSeparator(0);
            return utils_1.arrToDoc(tableName, (_b = tagData.extras) === null || _b === void 0 ? void 0 : _b.join(' | '), (_d = (_c = tagData.extras) === null || _c === void 0 ? void 0 : _c.map(function (_, i) { return createSeparator(i); })) === null || _d === void 0 ? void 0 : _d.join(' | '), columns);
        }
    }
];
