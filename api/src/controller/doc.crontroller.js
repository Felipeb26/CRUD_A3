"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicoController = void 0;
const constraints_utils_1 = require("../utils/constraints.utils");
const firebase_1 = require("../config/firebase");
const medico_model_1 = require("./../model/medico.model");
const medicosTable = firebase_1.db.collection("medicos");
class MedicoController {
    constructor() {
        this.getAllDocs = async (req, res) => {
            const data = await medicosTable.orderBy("nome", "asc").get();
            const medicos = [];
            try {
                data.docs.forEach((it) => {
                    const medico = new medico_model_1.Medicos(it.id, it.data().nome, it.data().telefone, it.data().email, it.data().senha, it.data().agenda, it.data().role, it.data().crm, it.data().especialidade);
                    medicos.push(medico);
                });
                return res.send(medicos);
            }
            catch (error) {
                console.log(error);
                return res.status(500).send({ erro: error.message });
            }
        };
        this.getById = async (req, res) => {
            try {
                const id = req.params.id;
                const it = await medicosTable.doc(id).get();
                if (!it.exists) {
                    res.status(404).send({ message: "usuarios não existe" });
                }
                else {
                    const medico = new medico_model_1.Medicos(it.id, it.data().nome, it.data().telefone, it.data().email, it.data().senha, it.data().agenda, it.data().role, it.data().crm, it.data().especialidade);
                    return res.send(medico);
                }
            }
            catch (error) {
                res.status(400).send({ message: error.message });
            }
        };
        this.addUser = async (req, res) => {
            try {
                const errorsList = [];
                let { nome, telefone, email, senha, agenda, role, crm, especialidade } = req.body;
                if (nome == null || undefined && telefone == null || undefined && email == null || undefined
                    && senha == null || undefined && role == null || undefined) {
                    return res.status(400).send({ message: "todos os campos devem ser preenchidos" });
                }
                if (agenda == null || undefined) {
                    agenda = Date.now();
                }
                const users = [];
                const request = await medicosTable.get();
                request.docs.forEach(it => {
                    const medico = new medico_model_1.Medicos(it.id, it.data().nome, it.data().telefone, it.data().email, it.data().senha, it.data().agenda, it.data().role, it.data().crm, it.data().especialidade);
                    users.push(medico);
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
                    "role": role,
                    "crm": crm,
                    "especialidade": especialidade
                };
                await medicosTable.doc().set(user);
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
                const data = await medicosTable.doc(id).get();
                if (!data.exists) {
                    return res.status(404).send({ message: "usuario não encontrado" });
                }
                const medico = new medico_model_1.Medicos(data.id, data.data().nome, data.data().telefone, data.data().email, data.data().senha, data.data().agenda, data.data().role, data.data().crm, data.data().especialidade);
                nome = (0, constraints_utils_1.ifNullNewValue)(nome, medico.getNome());
                telefone = (0, constraints_utils_1.ifNullNewValue)(telefone, medico.getTelefone());
                email = (0, constraints_utils_1.ifNullNewValue)(email, medico.getEmail());
                senha = (0, constraints_utils_1.ifNullNewValue)(senha, medico.getSenha());
                agenda = (0, constraints_utils_1.ifNullNewValue)(agenda, medico.getAgenda());
                role = (0, constraints_utils_1.ifNullNewValue)(role, medico.getRole());
                const userUpdate = {
                    "nome": nome,
                    "telefone": telefone,
                    "email": email,
                    "senha": senha,
                    "agenda": agenda,
                    "role": role
                };
                await medicosTable.doc(id).update(userUpdate);
                const saveUser = await medicosTable.doc(id).get();
                return res.send(saveUser.data());
            }
            catch (error) {
                return res.status(400).send({ message: error.message });
            }
        };
        this.deleteUser = async (req, res) => {
            try {
                const id = req.params.id;
                await medicosTable.doc(id).delete();
                res.send({ message: "Usuario deletado com sucesso!!" });
            }
            catch (error) {
                res.status(400).send({ message: error.message });
            }
        };
    }
}
exports.MedicoController = MedicoController;
