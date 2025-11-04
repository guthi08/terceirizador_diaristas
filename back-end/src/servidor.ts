import cors from "cors";
import express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import RotasUsuário from "./rotas/rotas-usuário";
import RotasGerenteEmpresa from "./rotas/rotas-gerente-empresa";

//add na etapa 2 tudo que tava no singular continua no singular e o que tava no plural continua no plural
import RotasDiarista from "./rotas/rotas-diarista";

const app = express();
const PORT = process.env.PORT
const CORS_ORIGIN = process.env.CORS_ORIGIN;
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use("/usuarios", RotasUsuário);
app.use("/gerentes-empresa", RotasGerenteEmpresa);
app.use("/diaristas", RotasDiarista); //tava no plural

app.listen(PORT || 3333);
const conexão = createConnection();
export default conexão;