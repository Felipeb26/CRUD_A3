import { Router } from "express";
import { MedicoController } from "../controller/doc.crontroller";
import { UsuariosController } from "../controller/user.controller";
import { authUser } from "../utils/token.utils";

export const route = Router({ caseSensitive: false });

const user = new UsuariosController()
const doc = new MedicoController();

//endpoints referentes ao usuario
route.get("/users", authUser, user.getAllUsers);

route.post("/login", user.getUserForLogin);

route.get("/user/:id", authUser, user.getById);

route.post("/users", user.addUser);

route.put("/user/:id", authUser, user.updateUser);

route.delete("/user/:id", authUser, user.deleteUser);

// endpoints referente ao medico
route.get("/docs", authUser, doc.getAllDocs);

route.post("/docs", user.addUser);

route.put("/docs/:id", authUser, doc.updateUser);

route.delete("/docs/:id", authUser, user.deleteUser);
