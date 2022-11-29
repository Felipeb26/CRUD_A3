export class Usuarios {

    private id: string;
    private nome: string;
    private telefone: string;
    private email: string;
    private senha: string;
    private agenda: any;
    private role: number;

    constructor (id: string, nome: string, telefone: string, email: string, senha: string, agenda: any, role: number) {
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

    setId(id: string) {
        this.id = id;
    }

    setNome(nome: string) {
        this.nome = nome;
    }

    settelefone(telefone: string) {
        this.telefone = telefone;
    }

    setEmail(email: string) {
        this.email = email;
    }

    setAgenda(agenda: any) {
        this.agenda = agenda
    }

    setSenha(senha: string) {
        this.senha = senha;
    }

    setRole(role: number) {
        this.role = role;
    }
}