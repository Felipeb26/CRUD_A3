import path from "path";
import { anyToDate } from "./src/utils/constraints.utils";
var rfs = require("rotating-file-stream"); // version 2.x

export const accessLogStream = rfs.createStream("access.log", {
    interval: "1d",
    path: path.join(__dirname, "log"),
});

const data = Date.now()

export const logger = (tokens: any, req: any, res: any) => {
    return [
        `Method: ${tokens.method(req, res)};`,
        `Url: ${tokens.url(req, res)}; `,
        `Status-code: ${tokens.status(req, res)}; `,
        `Content-Length: ${tokens.res(req, res, "content-length")}; `,
        `Response-Time: ${tokens["response-time"](req, res)}ms; `,
        `\nDate ${anyToDate(data)}`,
        "\n------------------------------------------------------------------------------------------------------\n",
    ].join("\t");
}