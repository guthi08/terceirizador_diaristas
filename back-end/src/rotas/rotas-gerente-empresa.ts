import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilGerenteEmpresa from "../middlewares/verificar-perfil-gerente-empresa";
import ServiçosGerenteEmpresa from "../serviços/serviços-gerente-empresa";

import verificarErroConteúdoToken from "../middlewares/verificar-erro-conteúdo-token"; 

const RotasGerenteEmpresa = Router();
export default RotasGerenteEmpresa;



RotasGerenteEmpresa.post("/", 
    ServiçosGerenteEmpresa.cadastrarGerenteEmpresa
);


RotasGerenteEmpresa.get("/:cpf", 
    verificarToken, 
    verificarPerfilGerenteEmpresa,   
    ServiçosGerenteEmpresa.buscarGerenteEmpresa
);


RotasGerenteEmpresa.patch("/", 
    verificarToken, 
    verificarPerfilGerenteEmpresa,
    ServiçosGerenteEmpresa.atualizarGerenteEmpresa
);



RotasGerenteEmpresa.post("/vagas-emprego", 
    verificarToken, 
    verificarPerfilGerenteEmpresa,
    ServiçosGerenteEmpresa.cadastrarVagaEmprego
);


RotasGerenteEmpresa.patch("/vagas-emprego", 
    verificarToken, 
    verificarPerfilGerenteEmpresa,
    ServiçosGerenteEmpresa.alterarVagaEmprego
);


RotasGerenteEmpresa.delete("/vagas-emprego/:id", 
    verificarToken, 
    verificarPerfilGerenteEmpresa,
    ServiçosGerenteEmpresa.removerVagaEmprego
);


RotasGerenteEmpresa.get("/vagas-emprego/gerente/:cpf", 
    verificarToken, 
    verificarPerfilGerenteEmpresa,
    verificarErroConteúdoToken, // Você usava este middleware aqui, então eu o mantive
    ServiçosGerenteEmpresa.buscarVagasGerenteEmpresa
);

