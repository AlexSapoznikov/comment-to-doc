"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
exports.commentParser = exports.defaultTags = void 0;
var readFiles_1 = require("./readFiles");
var getDocsJSON_1 = require("./getDocsJSON");
var createDoc_1 = require("./createDoc");
var getChildren_1 = require("./getChildren");
/**
 * Export types
 */
__exportStar(require("./types"), exports);
/**
 * Export default config
 */
var defaultConfig_1 = require("./defaultConfig");
__createBinding(exports, defaultConfig_1, "default", "defaultTags");
/**
 * Comment parser.
 * Pass defaultTags in tags if default children need to be parsed.
 *
 * @param comments
 * @param tags
 */
var commentParser = function (comments, tags) {
    if (tags === void 0) { tags = []; }
    var parsed = getDocsJSON_1.parser(comments);
    return getChildren_1.parseChildren(parsed, tags);
};
exports.commentParser = commentParser;
/**
 * Documentation generator
 * @param config
 */
var generateDocs = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var tags, filePaths, excludeFilePaths, fileContents, docsJSON;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tags = (config === null || config === void 0 ? void 0 : config.tags) || [];
                filePaths = (config === null || config === void 0 ? void 0 : config.files) && Array.isArray(config.files) ? config.files : [config.files];
                excludeFilePaths = (config === null || config === void 0 ? void 0 : config.excludeFiles) && Array.isArray(config.excludeFiles) ? config.excludeFiles : [config.excludeFiles];
                return [4 /*yield*/, readFiles_1.readFiles(filePaths, {
                        ignore: excludeFilePaths.filter(function (exists) { return exists; })
                    })];
            case 1:
                fileContents = _a.sent();
                docsJSON = getDocsJSON_1.getDocsJSON(fileContents);
                // Find children tags
                docsJSON = getChildren_1["default"](docsJSON, tags);
                // Generate docs
                return [2 /*return*/, createDoc_1.createDocs(docsJSON, tags, config)];
        }
    });
}); };
exports["default"] = generateDocs;
