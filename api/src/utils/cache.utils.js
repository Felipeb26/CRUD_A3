"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const caches = new node_cache_1.default({
    deleteOnExpire: true,
    checkperiod: 6000,
});
const duration = 300;
const cache = (err, req, res, next) => {
    if (req.method != "Get") {
        console.log("Cannot cache get methods");
        return next();
    }
    const key = req.originalUrl;
    const cachedResponse = caches.get(key);
    if (cachedResponse) {
        console.log(`Cached ${key}`);
        return res.send(cachedResponse);
    }
    else {
        console.log(`Cahe missed ${key}`);
        res.originalSend = res.send;
        res.send = (body) => {
            res.originalSend(body);
            caches.set(key, body, duration);
        };
        next();
    }
};
exports.cache = cache;
