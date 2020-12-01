"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.warn = exports.RuleError = void 0;
/**
 * Rule error
 */
var RuleError = /** @class */ (function (_super) {
    __extends(RuleError, _super);
    function RuleError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "Rule Error";
        _this.message = _this.name + ": " + _this.message;
        _this.stack = undefined;
        return _this;
    }
    return RuleError;
}(Error));
exports.RuleError = RuleError;
/**
 * Throws or logs error
 * @param msg
 */
var warn = function (msg) {
    console.warn(msg);
};
exports.warn = warn;
