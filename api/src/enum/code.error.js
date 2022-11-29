"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCode = void 0;
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["CREATED"] = 201] = "CREATED";
    StatusCode[StatusCode["ACEPTED"] = 202] = "ACEPTED";
    StatusCode[StatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCode[StatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCode[StatusCode["SERVER_ERROR"] = 500] = "SERVER_ERROR";
})(StatusCode = exports.StatusCode || (exports.StatusCode = {}));
