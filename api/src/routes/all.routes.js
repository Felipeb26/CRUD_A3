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
exports.route.get("/users", token_utils_1.authUser, user.getAllUsers);
exports.route.post("/login", user.getUserForLogin);
// route.get("/users-page", authUser, user.getAllPaginate);
exports.route.get("/user/:id", token_utils_1.authUser, user.getById);
exports.route.post("/users", user.addUser);
exports.route.put("/user/:id", token_utils_1.authUser, user.updateUser);
exports.route.delete("/user/:id", token_utils_1.authUser, user.deleteUser);
// endpoints referente ao medico
exports.route.get("/docs", token_utils_1.authUser, doc.getAllDocs);
exports.route.post("/docs", user.addUser);
exports.route.put("/docs/:id", token_utils_1.authUser, doc.updateUser);
exports.route.delete("/docs/:id", token_utils_1.authUser, user.deleteUser);
exports.route.get("/", async (req, res) => {
    return res.status(200).send({ message: "Crud is running" });
});
