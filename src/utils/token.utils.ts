require("dotenv").config();
import { Response } from "express";
import * as jwt from "jsonwebtoken";
let secret = process.env.ACESS_TOKEN_SECRET;

export const generateToken = (pass: any) => {
    if(secret == null || undefined){
        secret = "o_algoz_ninja_age_feito_o_vento"
    }
    const acessToken = jwt.sign({ id: pass }, secret!, { expiresIn: 9000 });
    return acessToken;
};

export const authUser = async (req: any, res: Response, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.status(401).send({ message: "unathorized" });
    }
    if (authHeader.toLowerCase().indexOf("bearer") == -1) {
        return res.status(401).send({ erro: "token invalido" });
    }
    try {
        await jwt.verify(token, secret as string);
        next();
    } catch (error) {
        return res.status(401).send({ erro: "token is expired" });
    }
};