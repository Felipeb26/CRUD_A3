import { db } from "../config/firebase";
import { ifNullNewValue, verifyRoles } from "../utils/constraints.utils";
import { StatusCode } from './../enum/code.error';
import { Medicos } from './../model/medico.model';
const medicosTable = db.collection("medicos")

export class MedicoController {

    getAllDocs = async (req: any, res: any) => {
        const id = req.params.id;
        try {
            if (id != null || undefined) {
                const it = await medicosTable.doc(id).get();
                if (!it.exists) {
                    res.status(404).send({ message: "usuarios não existe" });
                } else {
                    const medico = new Medicos(
                        it.id,
                        it.data()!.nome,
                        it.data()!.telefone,
                        it.data()!.email,
                        it.data()!.senha,
                        it.data()!.agenda,
                        it.data()!.role,
                        it.data()!.crm,
                        it.data()!.especialidade
                    );
                    return res.send(medico);
                }
            } else {
                const data = await medicosTable.orderBy("nome", "asc").get();
                const medicos: any = [];

                data.docs.forEach((it) => {
                    const medico = new Medicos(
                        it.id,
                        it.data().nome,
                        it.data().telefone,
                        it.data().email,
                        it.data().senha,
                        it.data().agenda,
                        it.data().role,
                        it.data().crm,
                        it.data().especialidade
                    );
                    medicos.push(medico);
                });
                return res.send(medicos);
            }
        } catch (error: any) {
            return res.status(StatusCode.SERVER_ERROR).send({ erro: error.message })
        }
    }

    DelPutPost = async (req: any, res: any) => {
        if (req.method === "POST") {
            try {
                const errorsList: Array<any> = []
                let { nome, telefone, email, senha, agenda, role, crm, especialidade } = req.body;
                if (nome == null || undefined && telefone == null || undefined && email == null || undefined
                    && senha == null || undefined && role == null || undefined) {
                    return res.status(400).send({ message: "todos os campos devem ser preenchidos" })
                }

                if (agenda == null || undefined) {
                    agenda = Date.now()
                }

                const users: Medicos[] = []
                const request = await medicosTable.get();
                request.docs.forEach(it => {
                    const medico = new Medicos(
                        it.id,
                        it.data()!.nome,
                        it.data()!.telefone,
                        it.data()!.email,
                        it.data()!.senha,
                        it.data()!.agenda,
                        it.data()!.role,
                        it.data()!.crm,
                        it.data()!.especialidade
                    );
                    users.push(medico);
                })

                users.forEach(it => {
                    if (it.getEmail() == email) {
                        errorsList.push(`Email: ${email} já foi cadastrado!`)
                    }
                    if (it.getAgenda() == agenda) {
                        errorsList.push(`Data: ${agenda} não pode ser selecionada`)
                    }
                    if (it.getTelefone() == telefone) {
                        errorsList.push(`Telefone: ${telefone} já foi cadastrado`)
                    }
                })

                if (errorsList.length > 0) {
                    return res.status(400).send(errorsList)
                }

                role = verifyRoles(role);
                const user = {
                    "nome": nome,
                    "telefone": telefone,
                    "email": email,
                    "senha": senha,
                    "agenda": agenda,
                    "role": role,
                    "crm": crm,
                    "especialidade": especialidade
                }

                await medicosTable.doc().set(user);
                return res.status(201).send(user);
            } catch (error: any) {
                console.log(error.message)
            }
        }
        if (req.method === "PUT") {
            try {
                const id = req.params.id;
                let { nome, telefone, email, senha, agenda, role } = req.body;

                const data = await medicosTable.doc(id).get();

                if (!data.exists) {
                    return res.status(404).send({ message: "usuario não encontrado" })
                }
                const medico = new Medicos(
                    data.id,
                    data.data()!.nome,
                    data.data()!.telefone,
                    data.data()!.email,
                    data.data()!.senha,
                    data.data()!.agenda,
                    data.data()!.role,
                    data.data()!.crm,
                    data.data()!.especialidade
                );

                nome = ifNullNewValue(nome, medico.getNome())
                telefone = ifNullNewValue(telefone, medico.getTelefone())
                email = ifNullNewValue(email, medico.getEmail())
                senha = ifNullNewValue(senha, medico.getSenha())
                agenda = ifNullNewValue(agenda, medico.getAgenda())
                role = ifNullNewValue(role, medico.getRole())

                const userUpdate = {
                    "nome": nome,
                    "telefone": telefone,
                    "email": email,
                    "senha": senha,
                    "agenda": agenda,
                    "role": role
                }

                await medicosTable.doc(id).update(userUpdate);
                const saveUser = await medicosTable.doc(id).get();
                return res.send(saveUser.data());
            } catch (error: any) {
                return res.status(400).send({ message: error.message });
            }
        }
        if (req.method === "DELETE") {
            try {
                const id = req.params.id;
                await medicosTable.doc(id).delete();
                res.send({ message: "Usuario deletado com sucesso!!" });
            } catch (error: any) {
                res.status(400).send({ message: error.message });
            }
        }
        if (req.method === "GET"){
            return res.status(StatusCode.FORBIDDEN).send("method dont allowed in this place")
        } 
    }

}