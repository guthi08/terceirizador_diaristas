import { Router } from "express";

import verificarToken from "../middlewares/verificar-token";
import verificarPerfilDiarista from "../middlewares/verificar-perfil-diarista";
import ServiçosDiarista from "../serviços/serviços-diarista";

const RotasDiarista = Router();
export default RotasDiarista;

RotasDiarista.post("/", ServiçosDiarista.cadastrarDiarista);
RotasDiarista.patch("/", verificarToken, verificarPerfilDiarista, ServiçosDiarista.atualizarDiarista);
RotasDiarista.get("/:cpf", verificarToken, verificarPerfilDiarista, ServiçosDiarista.buscarDiarista);