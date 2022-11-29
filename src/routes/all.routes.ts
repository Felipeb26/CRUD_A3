import { Router } from "express";
import { MedicoController } from "../controller/doc.crontroller";
import { UsuariosController } from "../controller/user.controller";
import { authUser } from "../utils/token.utils";
import { ConsultaController } from './../controller/consulta.controller';

export const route = Router({ caseSensitive: false });

const consult = new ConsultaController();
const user = new UsuariosController()
const doc = new MedicoController();

//endpoints referentes ao usuario
route.get("/users", authUser, user.getAllUsers);

route.post("/login", user.getUserForLogin);

route.get("/users-page", authUser, user.getAllPaginate);

route.get("/user/:id", authUser, user.getById);

route.post("/users", user.addUser);

route.put("/user/:id", authUser, user.updateUser);

route.delete("/user/:id", authUser, user.deleteUser);


// endpoints referente ao medico
route.get("/docs", authUser, doc.getAllDocs);

route.post("/docs", user.addUser);

route.put("/docs/:id", authUser, doc.updateUser);

route.delete("/docs/:id", authUser, user.deleteUser);

//consultas endpoints
route.get("/consultas", authUser, consult.getAll);

route.get("/consulta/:id", authUser, consult.getById);

route.get("/consultas/:param", authUser, consult.getConsultas)

route.post("/consultas", authUser, consult.postConsulta);

route.put("/consulta/:id", authUser, consult.updateConsulta);

route.delete("/consulta/:id", authUser, consult.deleteConsulta);


route.get("/", async (req, res) => {
    return res.status(200).send({ message: "Crud is running" })
})
