import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilGerenteEmpresa from "../middlewares/verificar-perfil-gerente-empresa";
import ServiçosGerenteEmpresa from "../serviços/serviços-gerente-empresa";
const RotasGerenteEmpresa = Router();
export default RotasGerenteEmpresa;
RotasGerenteEmpresa.post("/", ServiçosGerenteEmpresa.cadastrarGerenteEmpresa);
RotasGerenteEmpresa.get("/:cpf", verificarToken, verificarPerfilGerenteEmpresa,
 ServiçosGerenteEmpresa.buscarGerenteEmpresa);
