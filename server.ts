require("dotenv").config()
import { app } from "./src/middle";


const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`CRUD rodando em http://localhost:${port}`)
})

process.on("SIGINT", () => {
    server.close();
    console.log(`CRUD interrompido`)
})