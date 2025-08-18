import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilProfessor from "../middlewares/verificar-perfil-professor";
import ServiçosProfessor from "../serviços/serviços-professor";
const RotasProfessor = Router();
export default RotasProfessor;
RotasProfessor.post("/", ServiçosProfessor.cadastrarProfessor);
RotasProfessor.get("/:cpf", verificarToken, verificarPerfilProfessor,
 ServiçosProfessor.buscarProfessor);
