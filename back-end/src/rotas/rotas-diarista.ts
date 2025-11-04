import { Router } from "express";

import verificarToken from "../middlewares/verificar-token";
import verificarPerfilDiarista from "../middlewares/verificar-perfil-diarista";
import ServiçosDiarista from "../serviços/serviços-diarista";

// Adicionei este import, pois ele é usado em uma das rotas
import verificarErroConteúdoToken from "../middlewares/verificar-erro-conteúdo-token";

const RotasDiarista = Router();
export default RotasDiarista;

// ===========================================
// Rotas para GERENCIAR a própria Diarista
// ===========================================

// (Esta rota estava correta)
RotasDiarista.post("/", 
    ServiçosDiarista.cadastrarDiarista
);

// (Esta rota estava correta)
RotasDiarista.patch("/", 
    verificarToken, 
    verificarPerfilDiarista, 
    ServiçosDiarista.atualizarDiarista
);

// (Esta rota estava correta)
RotasDiarista.get("/:cpf", 
    verificarToken, 
    verificarPerfilDiarista, 
    ServiçosDiarista.buscarDiarista
);

// ===========================================
// Rotas para GERENCIAR os Interesses da Diarista
// (Substituindo as antigas rotas de "Interesses" do Aluno)
// ===========================================

// ANTES: RotasAluno.post("/interesses/", ... ServiçosAluno.cadastrarInteresse);
RotasDiarista.post("/interesses/", 
    verificarToken, 
    verificarPerfilDiarista,
    ServiçosDiarista.cadastrarInteresse // <-- Precisamos garantir que este método exista em ServiçosDiarista
);

// ANTES: RotasAluno.delete("/interesses/:id", ... ServiçosAluno.removerInteresse);
RotasDiarista.delete("/interesses/:id", 
    verificarToken, 
    verificarPerfilDiarista,
    ServiçosDiarista.removerInteresse // <-- Precisamos garantir que este método exista
);


RotasDiarista.get("/interesses/diarista/:cpf", 
    verificarToken, 
    verificarPerfilDiarista,
    verificarErroConteúdoToken, // Você usava este middleware aqui
    ServiçosDiarista.buscarInteressesDiarista // <-- Precisamos criar/renomear este método
);


RotasDiarista.get("/vagas-emprego/", 
    verificarToken, 
    verificarPerfilDiarista,
    ServiçosDiarista.buscarVagasEmprego // <-- Precisamos criar este método
);