"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUser = exports.generateToken = void 0;
require("dotenv").config();
const jwt = __importStar(require("jsonwebtoken"));
let secret = process.env.ACESS_TOKEN_SECRET;
const generateToken = (pass) => {
    if (secret == null || undefined) {
        secret = "o_algoz_ninja_age_feito_o_vento";
    }
    const acessToken = jwt.sign({ id: pass }, secret, { expiresIn: 9000 });
    return acessToken;
};
exports.generateToken = generateToken;
const authUser = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
        return res.status(401).send({ message: "unathorized" });
    }
    if (authHeader.toLowerCase().indexOf("bearer") == -1) {
        return res.status(401).send({ erro: "token invalido" });
    }
    try {
        await jwt.verify(token, secret);
        next();
    }
    catch (error) {
        return res.status(401).send({ erro: "token is expired" });
    }
};
exports.authUser = authUser;
