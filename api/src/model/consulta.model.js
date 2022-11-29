"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Consulta = void 0;
class Consulta {
    constructor(id, nomeUser, emailUser, telefoneUser, nomeMedico, emailMedico, agenda, prioridade, especialidadeMedico) {
        this.id = "";
        this.nomeUser = "";
        this.emailUser = "";
        this.telefoneUser = "";
        this.nomeMedico = "";
        this.emailMedico = "";
        this.agenda = "";
        this.prioridade = "";
        this.especialidadeMedico = "";
        this.id = id;
        this.nomeUser = nomeUser;
        this.emailUser = emailUser;
        this.telefoneUser = telefoneUser;
        this.nomeMedico = nomeMedico;
        this.emailMedico = emailMedico;
        this.agenda = agenda;
        this.prioridade = prioridade;
        this.especialidadeMedico = especialidadeMedico;
    }
    getId() {
        return this.id;
    }
    getnomeUser() {
        return this.nomeUser;
    }
    getEmailUser() {
        return this.emailUser;
    }
    getTelefoneUser() {
        return this.telefoneUser;
    }
    getNomeMedico() {
        return this.nomeMedico;
    }
    getEmailMedico() {
        return this.emailMedico;
    }
    getAgenda() {
        return this.agenda;
    }
    getPrioridade() {
        return this.prioridade;
    }
    getEspecialidadeMedico() {
        return this.especialidadeMedico;
    }
    setId(id) {
        this.id = id;
    }
    setnomeUser(nomeUser) {
        this.nomeUser = nomeUser;
    }
    setEmailUser(emailUser) {
        this.emailUser = emailUser;
    }
    setTelefoneUSer(telefoneUser) {
        this.telefoneUser = telefoneUser;
    }
    setNomeMedico(nomeMedico) {
        this.nomeMedico = nomeMedico;
    }
    setEmailMedico(emailMedico) {
        return this.emailMedico = emailMedico;
    }
    setAgenda(agenda) {
        this.agenda = agenda;
    }
    setPrioridade(prioridade) {
        this.prioridade = prioridade;
    }
    setEspecialidadeMedico(especialidadeMedico) {
        this.especialidadeMedico = especialidadeMedico;
    }
}
exports.Consulta = Consulta;
