"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.accessLogStream = void 0;
const path_1 = __importDefault(require("path"));
const constraints_utils_1 = require("./src/utils/constraints.utils");
var rfs = require("rotating-file-stream"); // version 2.x
exports.accessLogStream = rfs.createStream("access.log", {
    interval: "1d",
    path: path_1.default.join(__dirname, "log"),
});
const data = Date.now();
const logger = (tokens, req, res) => {
    return [
        `Method: ${tokens.method(req, res)};`,
        `Url: ${tokens.url(req, res)}; `,
        `Status-code: ${tokens.status(req, res)}; `,
        `Content-Length: ${tokens.res(req, res, "content-length")}; `,
        `Response-Time: ${tokens["response-time"](req, res)}ms; `,
        `\nDate ${(0, constraints_utils_1.anyToDate)(data)}`,
        "\n------------------------------------------------------------------------------------------------------\n",
    ].join("\t");
};
exports.logger = logger;
