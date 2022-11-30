"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const express_1 = require("express");
const doc_crontroller_1 = require("../controller/doc.crontroller");
const user_controller_1 = require("../controller/user.controller");
const token_utils_1 = require("../utils/token.utils");
exports.route = (0, express_1.Router)({ caseSensitive: false });
const user = new user_controller_1.UsuariosController();
const doc = new doc_crontroller_1.MedicoController();
//endpoints referentes ao usuario
exports.route.get("/users/:id?", token_utils_1.authUser, user.getAllUsers);
exports.route.post("/login", user.getUserForLogin);
exports.route.all("/user/:id", token_utils_1.authUser, user.DelPutPost);
// endpoints referente ao medico
exports.route.get("/docs/:id?", token_utils_1.authUser, doc.getAllDocs);
exports.route.all("/doc/:id?", token_utils_1.authUser, doc.DelPutPost);
