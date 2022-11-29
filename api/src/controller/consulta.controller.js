"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultaController = void 0;
const firebase_1 = require("../config/firebase");
const consulta_model_1 = require("../model/consulta.model");
const code_error_1 = require("./../enum/code.error");
const constraints_utils_1 = require("./../utils/constraints.utils");
const collection = firebase_1.db.collection("consultas");
class ConsultaController {
    constructor() {
        this.getAll = async (req, res) => {
            try {
                const data = await collection.orderBy("agenda", "asc").get();
                const consultas = [];
                data.docs.forEach(it => {
                    const cons = new consulta_model_1.Consulta(it.id, it.data().nomeUser, it.data().emailUser, it.data().telefoneUser, it.data().nomeMedico, it.data().emailMedico, (0, constraints_utils_1.anyToDate)(it.data().agenda), it.data().prioridade, it.data().especialidadeMedico);
                    consultas.push(cons);
                });
                return res.status(code_error_1.StatusCode.OK).send(consultas);
            }
            catch (error) {
                console.log(error);
                return res.status(code_error_1.StatusCode.SERVER_ERROR).send({ errro: error.message });
            }
        };
        this.getById = async (req, res) => {
            try {
                const id = req.params.id;
                const it = await collection.doc(id).get();
                if (!it.exists) {
                    return res.status(code_error_1.StatusCode.NOT_FOUND).send({ message: "não foi encontrado usuario" });
                }
                else {
                    const consulta = new consulta_model_1.Consulta(it.id, it.data().nomeUser, it.data().emailUser, it.data().telefoneUser, it.data().nomeMedico, it.data().emailMedico, (0, constraints_utils_1.anyToDate)(it.data().agenda), it.data().prioridade, it.data().especialidadeMedico);
                    return res.status(code_error_1.StatusCode.OK).send(consulta);
                }
            }
            catch (error) {
                console.log(error);
                return res.status(code_error_1.StatusCode.SERVER_ERROR).send({ message: error.message });
            }
        };
        this.getConsultas = async (req, res) => {
            try {
                let param = req.params.param;
                const data = await collection.orderBy("agenda", "asc").get();
                const consultas = [];
                if (param.indexOf("%") != -1) {
                    param = decodeURI(param);
                }
                data.docs.forEach(it => {
                    const cons = new consulta_model_1.Consulta(it.id, it.data().nomeUser, it.data().emailUser, it.data().telefoneUser, it.data().nomeMedico, it.data().emailMedico, (0, constraints_utils_1.anyToDate)(it.data().agenda), it.data().prioridade, it.data().especialidadeMedico);
                    consultas.push(cons);
                });
                let result = [];
                consultas.map(ap => {
                    if (ap.getEmailMedico() == param) {
                        console.log(ap);
                    }
                    if (ap.getEmailUser() == param) {
                        result.push(ap);
                    }
                });
                if (result.length <= 0) {
                    return res.status(code_error_1.StatusCode.NOT_FOUND).send({ message: "não foi encontrado nenhuma consulta!" });
                }
                return res.status(code_error_1.StatusCode.ACEPTED).send(result);
            }
            catch (error) {
                console.log(error);
                return res.status(code_error_1.StatusCode.SERVER_ERROR).send({ erro: error.message });
            }
        };
        this.postConsulta = async (req, res) => {
            try {
                let { nomeUser, emailUser, telefoneUser, nomeMedico, emailMedico, agenda, prioridade, especialidadeMedico } = req.body;
                if ((nomeMedico == null || undefined) || (emailMedico == null || undefined) ||
                    (nomeUser == null || undefined) || (emailUser == null || undefined) ||
                    (telefoneUser == null || undefined) || (agenda == null || undefined) ||
                    (especialidadeMedico == null || undefined)) {
                    return res.status(code_error_1.StatusCode.BAD_REQUEST).send({ messgae: "todos os campos devem ser informados!" });
                }
                if (prioridade == null || undefined) {
                    prioridade = "#0000ff";
                }
                const consulta = {
                    "nomeMedico": nomeMedico,
                    "emailMedico": emailMedico,
                    "nomeUser": nomeUser,
                    "emailUser": emailUser,
                    "telefoneUser": telefoneUser,
                    "agenda": new Date(agenda),
                    "prioridade": prioridade,
                    "especialidadeMedico": especialidadeMedico
                };
                await collection.doc().set(consulta);
                return res.status(code_error_1.StatusCode.CREATED).send(consulta);
            }
            catch (error) {
                return res.status(code_error_1.StatusCode.SERVER_ERROR).send({ message: error.message });
            }
        };
        this.updateConsulta = async (req, res) => {
            try {
                const id = req.params.id;
                let { nomeUser, emailUser, telefoneUser, nomeMedico, emailMedico, agenda, prioridade, especialidadeMedico } = req.body;
                const it = await collection.doc(id).get();
                let consulta;
                if (!it.exists) {
                    return res.status(code_error_1.StatusCode.NOT_FOUND).send({ message: "não foi possivel logalizar tal consulta" });
                }
                else {
                    consulta = new consulta_model_1.Consulta(it.id, it.data().nomeUser, it.data().emailUser, it.data().telefoneUser, it.data().nomeMedico, it.data().emailMedico, it.data().agenda, it.data().prioridade, it.data().especialidadeMedico);
                }
                nomeUser = (0, constraints_utils_1.ifNullNewValue)(nomeUser, consulta.getnomeUser());
                emailUser = (0, constraints_utils_1.ifNullNewValue)(emailUser, consulta.getEmailUser());
                telefoneUser = (0, constraints_utils_1.ifNullNewValue)(telefoneUser, consulta.getTelefoneUser());
                nomeMedico = (0, constraints_utils_1.ifNullNewValue)(nomeMedico, consulta.getNomeMedico());
                emailMedico = (0, constraints_utils_1.ifNullNewValue)(emailMedico, consulta.getEmailMedico());
                agenda = (0, constraints_utils_1.ifNullNewValue)(new Date(agenda), consulta.getAgenda());
                prioridade = (0, constraints_utils_1.ifNullNewValue)(prioridade, consulta.getPrioridade());
                especialidadeMedico = (0, constraints_utils_1.ifNullNewValue)(especialidadeMedico, consulta.getEspecialidadeMedico());
                const con = {
                    "nomeMedico": nomeMedico,
                    "emailMedico": emailMedico,
                    "nomeUser": nomeUser,
                    "emailUser": emailUser,
                    "telefoneUser": telefoneUser,
                    "agenda": agenda,
                    "prioridade": prioridade,
                    "especialidadeMedico": especialidadeMedico
                };
                await collection.doc(id).update(con);
                return res.status(code_error_1.StatusCode.ACEPTED).send(con);
            }
            catch (error) {
                return res.status(code_error_1.StatusCode.SERVER_ERROR).send({ erro: error.message });
            }
        };
        this.deleteConsulta = async (req, res) => {
            try {
                const id = req.params.id;
                const it = await collection.doc(id).get();
                if (!it.exists) {
                    return res.status(code_error_1.StatusCode.NOT_FOUND).send({ message: "" });
                }
                else {
                    await collection.doc(id).delete();
                    return res.status(code_error_1.StatusCode.ACEPTED).send({ message: "consulta cancelada" });
                }
            }
            catch (error) {
                return res.status(code_error_1.StatusCode.SERVER_ERROR).send({ erro: error.message });
            }
        };
    }
}
exports.ConsultaController = ConsultaController;
