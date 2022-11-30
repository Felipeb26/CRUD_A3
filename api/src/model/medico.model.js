"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Medicos = void 0;
class Medicos {
    constructor(id, nome, telefone, email, senha, agenda, role, crm, especialidade) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.agenda = agenda;
        this.senha = senha;
        this.role = role;
        this.crm = crm;
        this.especialidade = especialidade;
        this.telefone = telefone;
    }
    getId() {
        return this.id;
    }
    getNome() {
        return this.nome;
    }
    getTelefone() {
        return this.telefone;
    }
    getEmail() {
        return this.email;
    }
    getAgenda() {
        return this.agenda;
    }
    getSenha() {
        return this.senha;
    }
    getRole() {
        return this.role;
    }
    getCrm() {
        return this.crm;
    }
    getEspecialidade() {
        return this.especialidade;
    }
    setId(id) {
        this.id = id;
    }
    setNome(nome) {
        this.nome = nome;
    }
    setTelefone(telefone) {
        this.telefone = telefone;
    }
    setEmail(email) {
        this.email = email;
    }
    setAgenda(agenda) {
        this.agenda = agenda;
    }
    setSenha(senha) {
        this.senha = senha;
    }
    setRole(role) {
        this.role = role;
    }
    setCrm(crm) {
        this.crm = crm;
    }
    setEspecialidade(especialidade) {
        this.especialidade = especialidade;
    }
}
exports.Medicos = Medicos;
