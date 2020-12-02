"use strict";
/**
 * Default defined tags
 */
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var utils_1 = require("./utils");
var defaultTags = [
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
            var getContent = function (tag) {
                var value = getName(tag);
                var valueWithNewLines = value.split("\n").join('<br>');
                return valueWithNewLines.includes('<br>')
                    ? "<pre style=\"margin: 0\">" + valueWithNewLines + "</pre>"
                    : valueWithNewLines;
            };
            var toLength = function (string, length) {
                var _a, _b;
                var spacers = (_b = (_a = Array(length)) === null || _a === void 0 ? void 0 : _a.fill(' ')) === null || _b === void 0 ? void 0 : _b.join('');
                return (string + spacers).slice(0, string.length < length ? length : string.length);
            };
            // Table name
            var tableName = getContent(tagData);
            var headers = tagData.extras;
            var columns = headers.map(function (header) { return [header]; }); // [[header1], [header2], [header3], ...]
            var cells = tagData === null || tagData === void 0 ? void 0 : tagData.children;
            var table = '';
            // Find columns - [[header1, col1, ...], [header2, col2, ...], [header3, col3, ...], ...]
            cells === null || cells === void 0 ? void 0 : cells.forEach(function (cell) {
                if (cell.tag === 'Column') {
                    var foundColumn = columns.find(function (header) { var _a; return (header === null || header === void 0 ? void 0 : header[0]) === ((_a = cell.extras) === null || _a === void 0 ? void 0 : _a[0]); });
                    foundColumn.push(getContent(cell));
                }
            });
            // Fill missing cells with "-"
            headers.forEach(function (_, columnIndex) {
                columns.forEach(function (_, rowIndex) {
                    columns[rowIndex][columnIndex] = columns[rowIndex][columnIndex] || '-';
                });
            });
            // Make all cols same length
            headers.forEach(function (_, columnIndex) {
                var _a, _b;
                var longestInCol = (_b = (_a = __spreadArrays(columns[columnIndex])) === null || _a === void 0 ? void 0 : _a.sort(function (a, b) { return b.length - a.length; })) === null || _b === void 0 ? void 0 : _b[0];
                var length = longestInCol === null || longestInCol === void 0 ? void 0 : longestInCol.length;
                columns[columnIndex].forEach(function (_, cellIndex) {
                    var value = columns[columnIndex][cellIndex];
                    columns[columnIndex][cellIndex] = toLength(value, length);
                });
            });
            // Create table
            headers.forEach(function (_, columnIndex) {
                columns.forEach(function (_, rowIndex) {
                    var value = columns[rowIndex][columnIndex] || '-';
                    table += (value + ' | ');
                });
                // Next row
                table += '\n';
                // Add horizontal separator under headers
                if (columnIndex === 0) {
                    headers.forEach(function (_, headerIndex) {
                        var _a;
                        var colSeparator = Array((_a = columns === null || columns === void 0 ? void 0 : columns[headerIndex]) === null || _a === void 0 ? void 0 : _a[columnIndex].length).fill('-').join('');
                        table += colSeparator + ' | ';
                    });
                    table += '\n';
                }
            });
            return utils_1.arrToDoc(tableName, table);
        }
    },
    {
        tag: "Object",
        children: [
            {
                tag: "Key"
            }
        ],
        render: function (tagData) {
            var objectName = getName(tagData);
            var keys = (tagData === null || tagData === void 0 ? void 0 : tagData.children) || [];
            var objectDoc = '';
            keys.forEach(function (objectKey) {
                var _a, _b;
                var _c = objectKey.extras, key = _c[0], defaultValue = _c[1];
                var nested = key === null || key === void 0 ? void 0 : key.split('.');
                var keyName = nested[nested.length - 1];
                var place = (nested === null || nested === void 0 ? void 0 : nested.length) - 1;
                var spacer = Array(place).fill('  ').join('');
                var description = ((_b = (_a = [objectKey === null || objectKey === void 0 ? void 0 : objectKey.description, objectKey === null || objectKey === void 0 ? void 0 : objectKey.content]) === null || _a === void 0 ? void 0 : _a.filter(function (exists) { return exists; })) === null || _b === void 0 ? void 0 : _b.join(' ')) || '';
                var defaultValueText = (defaultValue ? " *(default: " + defaultValue + ")*" : '');
                var typeText = (objectKey === null || objectKey === void 0 ? void 0 : objectKey.type) ? " `" + (objectKey === null || objectKey === void 0 ? void 0 : objectKey.type) + "`" : undefined;
                objectDoc += [
                    spacer + "- **" + keyName + "**" + typeText + defaultValueText + "\n",
                    description.trim() ? spacer + "  " + description + "\n" : undefined,
                    ''
                ]
                    .filter(function (exists) { return exists || exists === ''; })
                    .join('\n');
            });
            return utils_1.arrToDoc(objectName, objectDoc);
        }
    },
];
function getName(tag) {
    var _a, _b;
    return ((_b = (_a = [tag === null || tag === void 0 ? void 0 : tag.description, tag === null || tag === void 0 ? void 0 : tag.content]) === null || _a === void 0 ? void 0 : _a.filter(function (exists) { return exists; })) === null || _b === void 0 ? void 0 : _b.join(' ')) || '';
}
exports["default"] = defaultTags;
