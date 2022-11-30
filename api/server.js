"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const middle_1 = require("./src/middle");
const port = process.env.PORT || 3000;
const server = middle_1.app.listen(port, () => {
    console.log(`CRUD rodando em http://localhost:${port}`);
});
process.on("SIGINT", () => {
    server.close();
    console.log(`CRUD interrompido`);
});
