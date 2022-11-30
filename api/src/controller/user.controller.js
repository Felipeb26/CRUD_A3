"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosController = void 0;
const firebase_1 = require("../config/firebase");
const medico_model_1 = require("../model/medico.model");
const constraints_utils_1 = require("../utils/constraints.utils");
const token_utils_1 = require("../utils/token.utils");
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
        this.getAllPaginate = async (req, res, next) => {
            try {
                let limit = req.query.limit || 10;
                let after = req.query.after;
                let before = req.query.before;
                let view = req.query.view || "agenda";
                limit = parseInt(limit);
                let data = usuariosCollections.orderBy(view, "asc");
                if (after) {
                    data = data.startAfter(after).limit(limit);
                }
                else if (before) {
                    data = data.endBefore(before).limit(limit);
                }
                else {
                    data = data.limit(limit);
                }
                const snapshots = await data.get();
                const userList = [];
                if (snapshots.empty) {
                    res.send(400).send({ message: "sem usuarios cadastrados" });
                }
                else {
                    snapshots.forEach((it) => {
                        const user = new usuariosmodel_1.Usuarios(it.id, it.data().nome, it.data().telefone, it.data().email, it.data().senha, it.data().agenda, it.data().role);
                        userList.push(user);
                    });
                }
                const content = {
                    users: userList,
                    pagination: {
                        prev: userList.length > 0 && (after || before)
                            ? userList[0].getAgenda()
                            : null,
                        next: userList.length == limit
                            ? userList[userList.length - 1].getAgenda()
                            : null,
                        totalElements: userList.length,
                    },
                };
                return res.status(200).send(content);
            }
            catch (error) {
                return res.status(400).send({ message: error.message });
            }
        };
        this.getAllUsers = async (req, res) => {
            const data = usuariosCollections.orderBy("agenda", "asc");
            const get = await data.get();
            const users = [];
            try {
                if (!get.empty) {
                    get.docs.forEach((it) => {
                        const user = new usuariosmodel_1.Usuarios(it.id, it.data().nome, it.data().telefone, it.data().email, it.data().senha, (0, constraints_utils_1.anyToDate)(it.data().agenda), it.data().role);
                        users.push(user);
                    });
                    return res.send(users);
                }
            }
            catch (error) {
                return res.status(400).send({ message: error.message });
            }
        };
        this.getAllConsultas = async (req, res) => {
            const medicos = medicosCollections.orderBy("agenda", "asc");
            const usuarios = usuariosCollections.orderBy("agenda", "asc");
            const medicoGet = await medicos.get();
            const usuarioGet = await usuarios.get();
            try {
                if (medicoGet.empty && usuarioGet.empty) {
                    return res.status(500).send({ erro: "erro" });
                }
                const usersList = [];
                const medicosList = [];
                usuarioGet.docs.forEach((it) => {
                    const user = new usuariosmodel_1.Usuarios(it.id, it.data().nome, it.data().telefone, it.data().email, it.data().senha, (0, constraints_utils_1.anyToDate)(it.data().agenda), it.data().role);
                    usersList.push(user);
                });
                medicoGet.docs.forEach((it) => {
                    const medico = new medico_model_1.Medicos(it.id, it.data().nome, it.data().telefone, it.data().email, it.data().senha, (0, constraints_utils_1.anyToDate)(it.data().agenda), it.data().role, it.data().crm, it.data().especialidade);
                    medicosList.push(medico);
                });
                const dates = [];
                const doctors = [];
                usersList.forEach(it => dates.push(it.getAgenda()));
                for (let i = 0; i < dates.length; i++) {
                    const doc = medicosList.filter(it => it.getAgenda() == dates[i]);
                    for (let m = 0; m < doc.length; m++) {
                        doctors.push(doc[i]);
                    }
                }
                return res.status(200).send(doctors);
            }
            catch (erro) {
                return res.status(400).send({ message: erro.message });
            }
        };
        this.getById = async (req, res) => {
            try {
                const id = req.params.id;
                const it = await usuariosCollections.doc(id).get();
                if (!it.exists) {
                    res.status(404).send({ message: "usuarios não existe" });
                }
                else {
                    const user = new usuariosmodel_1.Usuarios(it.id, it.data().nome, it.data().telefone, it.data().email, it.data().senha, (0, constraints_utils_1.anyToDate)(it.data().agenda), it.data().role);
                    res.send(user);
                }
            }
            catch (error) {
                res.status(400).send({ message: error.message });
            }
        };
        this.addUser = async (req, res) => {
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
            }
        };
        this.updateUser = async (req, res) => {
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
                return res.status(400).send({ message: error.message });
            }
        };
        this.deleteUser = async (req, res) => {
            try {
                const id = req.params.id;
                await usuariosCollections.doc(id).delete();
                res.send({ message: "Usuario deletado com sucesso!!" });
            }
            catch (error) {
                res.status(400).send({ message: error.message });
            }
        };
    }
}
exports.UsuariosController = UsuariosController;
