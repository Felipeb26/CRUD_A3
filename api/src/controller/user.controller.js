"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosController = void 0;
const firebase_1 = require("../config/firebase");
const medico_model_1 = require("../model/medico.model");
const constraints_utils_1 = require("../utils/constraints.utils");
const token_utils_1 = require("../utils/token.utils");
const code_error_1 = require("./../enum/code.error");
const usuariosmodel_1 = require("./../model/usuariosmodel.");
const usuariosCollections = firebase_1.db.collection("usuarios");
const medicosCollections = firebase_1.db.collection("medicos");
class UsuariosController {
    constructor() {
        this.getUserForLogin = async (req, res) => {
            try {
                const userList = [];
                const doctorsList = [];
                let { senha, email } = req.body;
                await usuariosCollections
                    .where("senha", "==", senha)
                    .get()
                    .then((snap) => {
                    snap.forEach((doc) => {
                        const user = new usuariosmodel_1.Usuarios(doc.id, doc.data().nome, doc.data().telefone, doc.data().email, doc.data().senha, doc.data().agenda, doc.data().role);
                        userList.push(user);
                    });
                })
                    .catch((err) => res.send({ message: err.message }));
                await medicosCollections.where("senha", "==", senha).get()
                    .then((snap) => {
                    snap.forEach((it) => {
                        const medico = new medico_model_1.Medicos(it.id, it.data().nome, it.data().telefone, it.data().email, it.data().senha, it.data().agenda, it.data().role, it.data().crm, it.data().especialidade);
                        doctorsList.push(medico);
                    });
                });
                const all = [...userList, ...doctorsList];
                const index = all.find(it => it.getEmail() === email);
                if (index?.getId() == undefined || null) {
                    return res
                        .status(404)
                        .send({ erro: `usuario nao encontrado ${email}` });
                }
                const user = index;
                const tk = {
                    id: "id",
                    nome: "nome",
                    email: "email",
                    senha: "senha",
                    telefone: "telefone",
                    crm: "crm"
                };
                if (user instanceof usuariosmodel_1.Usuarios) {
                    (tk.id = user.getId());
                    (tk.nome = user.getNome());
                    (tk.email = user.getEmail());
                    (tk.senha = user.getSenha());
                    (tk.telefone = user.getTelefone());
                }
                else if (user instanceof medico_model_1.Medicos) {
                    (tk.id = user.getId());
                    (tk.nome = user.getNome());
                    (tk.email = user.getEmail());
                    (tk.senha = user.getSenha());
                    (tk.telefone = user.getTelefone());
                    (tk.crm = user.getCrm());
                }
                res.send({
                    token: `${(0, token_utils_1.generateToken)(user)}`,
                    tokenType: "Bearer",
                    TokenTime: "15 min",
                });
            }
            catch (error) {
                console.log(error);
                res.status(400).send({ message: error.message });
            }
        };
        this.getAllUsers = async (req, res) => {
            const id = req.params.id;
            try {
                if (id == null || undefined) {
                    const data = usuariosCollections.orderBy("agenda", "asc");
                    const get = await data.get();
                    const users = [];
                    if (!get.empty) {
                        get.docs.forEach((it) => {
                            const user = new usuariosmodel_1.Usuarios(it.id, it.data().nome, it.data().telefone, it.data().email, it.data().senha, (0, constraints_utils_1.anyToDate)(it.data().agenda), it.data().role);
                            users.push(user);
                        });
                        return res.send(users);
                    }
                }
                else {
                    const it = await usuariosCollections.doc(id).get();
                    if (!it.exists) {
                        res.status(404).send({ message: "usuarios não existe" });
                    }
                    else {
                        const user = new usuariosmodel_1.Usuarios(it.id, it.data().nome, it.data().telefone, it.data().email, it.data().senha, (0, constraints_utils_1.anyToDate)(it.data().agenda), it.data().role);
                        res.send(user);
                    }
                }
            }
            catch (error) {
                return res.status(code_error_1.StatusCode.SERVER_ERROR).send({ message: error.message });
            }
        };
        this.DelPutPost = async (req, res) => {
            if (req.method == "GET") {
                return res.status(code_error_1.StatusCode.FORBIDDEN).send("method not allowed");
            }
            if (req.method == "POST") {
                try {
                    const errorsList = [];
                    let { nome, telefone, email, senha, agenda, role } = req.body;
                    if (nome == null || undefined && telefone == null || undefined && email == null || undefined
                        && senha == null || undefined && role == null || undefined) {
                        return res.status(400).send({ message: "todos os campos devem ser preenchidos" });
                    }
                    if (agenda == null || undefined) {
                        agenda = Date.now();
                    }
                    const users = [];
                    const request = await usuariosCollections.get();
                    request.docs.forEach(it => {
                        const user = new usuariosmodel_1.Usuarios(it.id, it.data().nome, it.data().telefone, it.data().email, it.data().senha, it.data().agenda, it.data().role);
                        users.push(user);
                    });
                    users.forEach(it => {
                        if (it.getEmail() == email) {
                            errorsList.push(`Email: ${email} já foi cadastrado!`);
                        }
                        if (it.getAgenda() == agenda) {
                            errorsList.push(`Data: ${agenda} não pode ser selecionada`);
                        }
                        if (it.getTelefone() == telefone) {
                            errorsList.push(`Telefone: ${telefone} já foi cadastrado`);
                        }
                    });
                    if (errorsList.length > 0) {
                        return res.status(400).send(errorsList);
                    }
                    role = (0, constraints_utils_1.verifyRoles)(role);
                    const user = {
                        "nome": nome,
                        "telefone": telefone,
                        "email": email,
                        "senha": senha,
                        "agenda": agenda,
                        "role": role
                    };
                    await usuariosCollections.doc().set(user);
                    return res.status(201).send(user);
                }
                catch (error) {
                    console.log(error.message);
                    return res.status(code_error_1.StatusCode.SERVER_ERROR).send(error.message);
                }
            }
            if (req.method == "PUT") {
                try {
                    const id = req.params.id;
                    let { nome, telefone, email, senha, agenda, role } = req.body;
                    const data = await usuariosCollections.doc(id).get();
                    if (!data.exists) {
                        return res.status(404).send({ message: "usuario não encontrado" });
                    }
                    const user = new usuariosmodel_1.Usuarios(data.id, data.data().nome, data.data().telefone, data.data().email, data.data().senha, data.data().agenda, data.data().role);
                    nome = (0, constraints_utils_1.ifNullNewValue)(nome, user.getNome());
                    telefone = (0, constraints_utils_1.ifNullNewValue)(telefone, user.getTelefone());
                    email = (0, constraints_utils_1.ifNullNewValue)(email, user.getEmail());
                    senha = (0, constraints_utils_1.ifNullNewValue)(senha, user.getSenha());
                    agenda = (0, constraints_utils_1.ifNullNewValue)(agenda, user.getAgenda());
                    role = (0, constraints_utils_1.ifNullNewValue)(role, user.getRole());
                    const userUpdate = {
                        "nome": nome,
                        "telefone": telefone,
                        "email": email,
                        "senha": senha,
                        "agenda": agenda,
                        "role": role
                    };
                    await usuariosCollections.doc(id).update(userUpdate);
                    return res.status(202).send(userUpdate);
                }
                catch (error) {
                    return res.status(code_error_1.StatusCode.SERVER_ERROR).send({ message: error.message });
                }
            }
            if (req.method == "DELETE") {
                try {
                    const id = req.params.id;
                    await usuariosCollections.doc(id).delete();
                    res.send({ message: "Usuario deletado com sucesso!!" });
                }
                catch (error) {
                    res.status(400).send({ message: error.message });
                }
            }
        };
    }
}
exports.UsuariosController = UsuariosController;
