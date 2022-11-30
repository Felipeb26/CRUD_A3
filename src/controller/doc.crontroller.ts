import { ifNullNewValue, verifyRoles } from "../utils/constraints.utils";
import { db } from "../config/firebase";
import { Medicos } from './../model/medico.model';
const medicosTable = db.collection("medicos")

export class MedicoController {

    getAllDocs = async (req: any, res: any) => {
        const data = await medicosTable.orderBy("nome", "asc").get();
        const medicos: any = [];

        try {
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
        } catch (error: any) {
            console.log(error)
            return res.status(500).send({ erro: error.message })
        }
    }

    // getById = async (req: any, res: any) => {
    //     try {
    //         const id = req.params.id;
    //         const it = await medicosTable.doc(id).get();
    //         if (!it.exists) {
    //             res.status(404).send({ message: "usuarios não existe" });
    //         } else {
    //             const medico = new Medicos(
    //                 it.id,
    //                 it.data()!.nome,
    //                 it.data()!.telefone,
    //                 it.data()!.email,
    //                 it.data()!.senha,
    //                 it.data()!.agenda,
    //                 it.data()!.role,
    //                 it.data()!.crm,
    //                 it.data()!.especialidade
    //             );
    //             return res.send(medico);
    //         }
    //     } catch (error: any) {
    //         res.status(400).send({ message: error.message });
    //     }
    // };

    addUser = async (req: any, res: any) => {
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

    updateUser = async (req: any, res: any) => {
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
    };

    deleteUser = async (req: any, res: any) => {
        try {
            const id = req.params.id;
            await medicosTable.doc(id).delete();
            res.send({ message: "Usuario deletado com sucesso!!" });
        } catch (error: any) {
            res.status(400).send({ message: error.message });
        }
    };
}