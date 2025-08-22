import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilProfessor from "../middlewares/verificar-perfil-gerente-empresa";
import ServiçosGerenteEmpresa from "../serviços/serviços-gerente-empresa";
const RotasGerenteEmpresa = Router();
export default RotasGerenteEmpresa;
RotasGerenteEmpresa.post("/", ServiçosGerenteEmpresa.cadastrarGerenteEmpresa);
RotasGerenteEmpresa.get("/:cpf", verificarToken, verificarPerfilProfessor,
 ServiçosGerenteEmpresa.buscarGerenteEmpresa);
