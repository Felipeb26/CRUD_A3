require("dotenv").config()
import compression from "compression";
import cors from "cors";
import express from "express";
import * as swaggerUi from "swagger-ui-express";
import swaggerDoc from "./swagger.json";

export const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cors({ origin: "*" }))
app.use(compression({ memLevel: 2 }))

// app.use(morgan(logger, { stream: accessLogStream }))

import { route } from "./src/routes/all.routes";
app.use(route)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));



const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`CRUD rodando em http://localhost:${port}`)
})

process.on("SIGINT", () => {
    server.close();
    console.log(`CRUD interrompido`)
})