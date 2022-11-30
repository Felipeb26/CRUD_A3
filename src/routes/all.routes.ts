import { Router } from "express";
import { MedicoController } from "../controller/doc.crontroller";
import { UsuariosController } from "../controller/user.controller";
import { authUser } from "../utils/token.utils";

export const route = Router({ caseSensitive: false });

const user = new UsuariosController()
const doc = new MedicoController();

//endpoints referentes ao usuario
route.get("/users/:id?", authUser, user.getAllUsers);

route.post("/login", user.getUserForLogin);

route.all("/user/:id", authUser, user.DelPutPost);

// endpoints referente ao medico
route.get("/docs/:id?", authUser, doc.getAllDocs);

route.all("/doc/:id?", authUser, doc.DelPutPost)
