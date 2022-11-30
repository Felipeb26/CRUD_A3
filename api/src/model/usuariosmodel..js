"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuarios = void 0;
class Usuarios {
    constructor(id, nome, telefone, email, senha, agenda, role) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.senha = senha;
        this.agenda = agenda;
        this.role = role;
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
    setId(id) {
        this.id = id;
    }
    setNome(nome) {
        this.nome = nome;
    }
    settelefone(telefone) {
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
}
exports.Usuarios = Usuarios;
