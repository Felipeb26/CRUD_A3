import { db } from "../config/firebase";
import { Consulta } from "../model/consulta.model";
import { StatusCode } from './../enum/code.error';
import { anyToDate, ifNullNewValue } from './../utils/constraints.utils';

const collection = db.collection("consultas");

export class ConsultaController {

    getAll = async (req: any, res: any) => {
        try {
            const data = await collection.orderBy("agenda", "asc").get();
            const consultas: Consulta[] = []

            data.docs.forEach(it => {
                const cons = new Consulta(
                    it.id,
                    it.data().nomeUser,
                    it.data().emailUser,
                    it.data().telefoneUser,
                    it.data().nomeMedico,
                    it.data().emailMedico,
                    anyToDate(it.data().agenda),
                    it.data().prioridade,
                    it.data().especialidadeMedico,
                );
                consultas.push(cons)
            })

            return res.status(StatusCode.OK).send(consultas)
        } catch (error: any) {
            console.log(error)
            return res.status(StatusCode.SERVER_ERROR).send({ errro: error.message })
        }
    }

    getById = async (req: any, res: any) => {
        try {
            const id = req.params.id;
            const it = await collection.doc(id).get();

            if (!it.exists) {
                return res.status(StatusCode.NOT_FOUND).send({ message: "não foi encontrado usuario" })
            } else {
                const consulta = new Consulta(
                    it.id,
                    it.data()!.nomeUser,
                    it.data()!.emailUser,
                    it.data()!.telefoneUser,
                    it.data()!.nomeMedico,
                    it.data()!.emailMedico,
                    anyToDate(it.data()!.agenda),
                    it.data()!.prioridade,
                    it.data()!.especialidadeMedico
                );
                return res.status(StatusCode.OK).send(consulta)
            }
        } catch (error: any) {
            console.log(error)
            return res.status(StatusCode.SERVER_ERROR).send({ message: error.message })
        }
    }

    getConsultas = async (req: any, res: any) => {
        try {
            let param = req.params.param;
            const data = await collection.orderBy("agenda", "asc").get();
            const consultas: Consulta[] = []

            if (param.indexOf("%") != -1) {
                param = decodeURI(param);
            }

            data.docs.forEach(it => {
                const cons = new Consulta(
                    it.id,
                    it.data().nomeUser,
                    it.data().emailUser,
                    it.data().telefoneUser,
                    it.data().nomeMedico,
                    it.data().emailMedico,
                    anyToDate(it.data().agenda),
                    it.data().prioridade,
                    it.data().especialidadeMedico,
                );
                consultas.push(cons);
            });

            let result: Consulta[] = []
            consultas.map(ap => {
                if (ap.getEmailMedico() == param) {
                    console.log(ap)
                }
                if (ap.getEmailUser() == param) {
                    result.push(ap)
                }
            });

            if (result.length <= 0) {
                return res.status(StatusCode.NOT_FOUND).send({ message: "não foi encontrado nenhuma consulta!" })
            }

            return res.status(StatusCode.ACEPTED).send(result);
        } catch (error: any) {
            console.log(error);
            return res.status(StatusCode.SERVER_ERROR).send({ erro: error.message })
        }
    }

    postConsulta = async (req: any, res: any) => {
        try {
            let { nomeUser, emailUser, telefoneUser, nomeMedico, emailMedico, agenda, prioridade, especialidadeMedico } = req.body;

            if (
                (nomeMedico == null || undefined) || (emailMedico == null || undefined) ||
                (nomeUser == null || undefined) || (emailUser == null || undefined) ||
                (telefoneUser == null || undefined) || (agenda == null || undefined) ||
                (especialidadeMedico == null || undefined)) {
                return res.status(StatusCode.BAD_REQUEST).send({ messgae: "todos os campos devem ser informados!" })
            }

            if (prioridade == null || undefined) {
                prioridade = "#0000ff"
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
            }

            await collection.doc().set(consulta);
            return res.status(StatusCode.CREATED).send(consulta)
        } catch (error: any) {
            return res.status(StatusCode.SERVER_ERROR).send({ message: error.message })
        }
    }

    updateConsulta = async (req: any, res: any) => {
        try {
            const id = req.params.id;
            let { nomeUser, emailUser, telefoneUser, nomeMedico, emailMedico, agenda, prioridade, especialidadeMedico } = req.body;
            const it = await collection.doc(id).get();

            let consulta: Consulta;
            if (!it.exists) {
                return res.status(StatusCode.NOT_FOUND).send({ message: "não foi possivel logalizar tal consulta" })
            } else {
                consulta = new Consulta(
                    it.id,
                    it.data()!.nomeUser,
                    it.data()!.emailUser,
                    it.data()!.telefoneUser,
                    it.data()!.nomeMedico,
                    it.data()!.emailMedico,
                    it.data()!.agenda,
                    it.data()!.prioridade,
                    it.data()!.especialidadeMedico,
                );
            }

            nomeUser = ifNullNewValue(nomeUser, consulta.getnomeUser());
            emailUser = ifNullNewValue(emailUser, consulta.getEmailUser());
            telefoneUser = ifNullNewValue(telefoneUser, consulta.getTelefoneUser());
            nomeMedico = ifNullNewValue(nomeMedico, consulta.getNomeMedico());
            emailMedico = ifNullNewValue(emailMedico, consulta.getEmailMedico());
            agenda = ifNullNewValue(new Date(agenda), consulta.getAgenda());
            prioridade = ifNullNewValue(prioridade, consulta.getPrioridade());
            especialidadeMedico = ifNullNewValue(especialidadeMedico, consulta.getEspecialidadeMedico());

            const con = {
                "nomeMedico": nomeMedico,
                "emailMedico": emailMedico,
                "nomeUser": nomeUser,
                "emailUser": emailUser,
                "telefoneUser": telefoneUser,
                "agenda": agenda,
                "prioridade": prioridade,
                "especialidadeMedico": especialidadeMedico
            }

            await collection.doc(id).update(con);
            return res.status(StatusCode.ACEPTED).send(con);
        } catch (error: any) {
            return res.status(StatusCode.SERVER_ERROR).send({ erro: error.message })
        }
    }

    deleteConsulta = async (req: any, res: any) => {
        try {
            const id = req.params.id;
            const it = await collection.doc(id).get();

            if (!it.exists) {
                return res.status(StatusCode.NOT_FOUND).send({ message: "" })
            } else {
                await collection.doc(id).delete();
                return res.status(StatusCode.ACEPTED).send({ message: "consulta cancelada" })
            }
        } catch (error: any) {
            return res.status(StatusCode.SERVER_ERROR).send({ erro: error.message })
        }
    }

}