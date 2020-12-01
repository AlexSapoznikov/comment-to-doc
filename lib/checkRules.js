"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRules = exports.validate = void 0;
var lodash_isequal_1 = require("lodash.isequal");
var error_1 = require("./error");
var types_1 = require("./types");
function validate(doc, config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var rules = (_a = config === null || config === void 0 ? void 0 : config.template) === null || _a === void 0 ? void 0 : _a.rules;
    var strictness = (_b = config === null || config === void 0 ? void 0 : config.template) === null || _b === void 0 ? void 0 : _b.strictness;
    var ruleCheck = rules ? checkRules(doc === null || doc === void 0 ? void 0 : doc.data, rules) : {};
    var errorHandling = (_c = config === null || config === void 0 ? void 0 : config.template) === null || _c === void 0 ? void 0 : _c.errorHandling;
    var isError = ruleCheck[strictness] || !!((_d = ruleCheck.forbiddenTags) === null || _d === void 0 ? void 0 : _d.length);
    // Log errors
    if ((_e = ruleCheck.forbiddenTags) === null || _e === void 0 ? void 0 : _e.length) {
        var uniqueForbidden = Array.from(new Set(ruleCheck.forbiddenTags));
        var uniqueRules = Array.from(new Set(rules.map(function (r) { return r.tag; })));
        error_1.warn("\n  \u2022 Found forbidden tags: " + uniqueForbidden.map(function (tag) { return "\"" + tag + "\""; }).join(', ') + ".\n  > Allowed tags are " + ((_f = uniqueRules === null || uniqueRules === void 0 ? void 0 : uniqueRules.map(function (ruleTag) { return "\"" + ruleTag + "\""; })) === null || _f === void 0 ? void 0 : _f.join(', ')) + ".\n    ");
    }
    // Stop here if errors exist
    if (isError) {
        // Strict warnings
        if (strictness === types_1.TemplateStrictness.Strict) {
            error_1.warn("\n  \u2022 Order of the tags is invalid: " + ((_g = ruleCheck.tagsOrder) === null || _g === void 0 ? void 0 : _g.map(function (tag) { return "\"" + tag + "\""; }).join(', ')) + ".\n  > The order must be following: " + ((_j = (_h = ruleCheck.rulesOrder) === null || _h === void 0 ? void 0 : _h.map(function (ruleTag) { return "\"" + ruleTag + "\""; })) === null || _j === void 0 ? void 0 : _j.join(', ')) + ".\n      ");
        }
        // Ignore order warnings
        if (strictness === types_1.TemplateStrictness.IgnoreOrder) {
            error_1.warn("\n  \u2022 Tags didn't match rules: " + ((_k = ruleCheck.tagsOrder) === null || _k === void 0 ? void 0 : _k.map(function (tag) { return "\"" + tag + "\""; }).join(', ')) + ".\n  > Following tags are required to be defined: " + ((_m = (_l = ruleCheck.rulesOrder) === null || _l === void 0 ? void 0 : _l.map(function (ruleTag) { return "\"" + ruleTag + "\""; })) === null || _m === void 0 ? void 0 : _m.join(', ')) + ".\n      ");
        }
        // If error handling is ERROR, do not generate doc
        if ((errorHandling !== null && errorHandling !== void 0 ? errorHandling : types_1.ErrorHandling.Error) === types_1.ErrorHandling.Error) {
            throw new error_1.RuleError('Documents not generated due to the validation errors. For more info, see warnings above.');
        }
    }
    return isError;
}
exports.validate = validate;
function checkRules(docData, rules) {
    var _a;
    var mandatoryRulesOrder = rules === null || rules === void 0 ? void 0 : rules.filter(function (rule) { return rule.mandatory; }).map(function (rule) { return rule.tag; });
    var docTags = docData.map(function (tag) { return tag.tag; });
    var forbiddenTags = [];
    // Find doc tags mandatory order
    var mandatoryRules = __spreadArrays(mandatoryRulesOrder || []);
    var mandatoryDocTagsOrder = docTags.reduce(function (docTagsOrder, next) {
        var index = mandatoryRules.indexOf(next);
        if (index < 0) {
            return docTagsOrder;
        }
        mandatoryRules.splice(index, 1);
        docTagsOrder.push(next);
        return docTagsOrder;
    }, []);
    // Check some other rules
    docTags.forEach(function (docTag) {
        var ruleIndex = rules === null || rules === void 0 ? void 0 : rules.findIndex(function (rule) { return rule.tag === docTag; });
        var rule = rules[ruleIndex];
        // Forbidden rule check
        if (!rule) {
            return forbiddenTags.push(docTag);
        }
    });
    return _a = {},
        _a[types_1.TemplateStrictness.Strict] = !lodash_isequal_1.default(mandatoryRulesOrder, mandatoryDocTagsOrder),
        _a[types_1.TemplateStrictness.IgnoreOrder] = !lodash_isequal_1.default(__spreadArrays((mandatoryRulesOrder || [])).sort(), __spreadArrays((mandatoryDocTagsOrder || [])).sort()),
        _a.rulesOrder = mandatoryRulesOrder,
        _a.tagsOrder = mandatoryDocTagsOrder,
        _a.forbiddenTags = forbiddenTags,
        _a;
}
exports.checkRules = checkRules;
