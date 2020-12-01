"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.createDocs = void 0;
var path = require("path");
var checkRules_1 = require("./checkRules");
var util_1 = require("util");
var fs_1 = require("fs");
var writeFile$ = util_1.promisify(fs_1.writeFile);
// Default JSON to doc render function
var defaultRender = function (tagData) {
    return [
        "## " + tagData.tag,
        tagData === null || tagData === void 0 ? void 0 : tagData.content,
        (tagData === null || tagData === void 0 ? void 0 : tagData.content) ? '' : null
    ]
        .filter(function (line) { return line !== null; })
        .join('\n');
};
var createDocs = function (docsJSON, tags, config) {
    // console.log('docsJSON', JSON.stringify(docsJSON, null, 2));
    // console.log('tags', tags);
    Promise.all(docsJSON.map(function (doc) { return writeToFile(doc, tags, config); }));
};
exports.createDocs = createDocs;
function writeToFile(doc, tags, config) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var documentText, docName, docPath, docExt, outputPath, isStrictTags;
        return __generator(this, function (_c) {
            documentText = [];
            docName = path.basename(doc.path, path.extname(doc.path));
            docPath = path.dirname(doc.path);
            docExt = config.outputExt;
            outputPath = (_b = (_a = config === null || config === void 0 ? void 0 : config.output) === null || _a === void 0 ? void 0 : _a.call(config, docPath, docName)) !== null && _b !== void 0 ? _b : docPath + "/" + docName + "." + (docExt !== null && docExt !== void 0 ? docExt : 'md');
            isStrictTags = config === null || config === void 0 ? void 0 : config.strict;
            checkRules_1.validate(doc, config);
            // Combine data
            doc === null || doc === void 0 ? void 0 : doc.data.forEach(function (tagData) {
                var tagOpts = tags.find(function (tag) { return tag.tag === tagData.tag; });
                var render = (tagOpts === null || tagOpts === void 0 ? void 0 : tagOpts.render) || defaultRender;
                // If tag does not exist in "tags" array and is forbidden to use, do not use it
                if (isStrictTags && !tagOpts) {
                    return;
                }
                // Add rendered comment to document text array
                documentText.push(render(tagData));
            });
            // Write to file
            return [2 /*return*/, writeFile$(outputPath, documentText.join("\n"), {
                    encoding: 'utf8',
                    flag: 'w'
                })];
        });
    });
}
