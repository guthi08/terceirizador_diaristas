import servidor from "./servidor";

// ===========================================
// Funções para GERENCIAR a própria Diarista
// ===========================================

// (Esta função estava CORRETA)
export function serviçoCadastrarDiarista(diarista) { 
    return servidor.post("/diaristas", diarista); 
};

// (Esta função estava CORRETA)
export function serviçoAtualizarDiarista(diarista) { 
    return servidor.patch("/diaristas", diarista); 
};

// (Esta função estava CORRETA)
export function serviçoBuscarDiarista(cpf) { 
    return servidor.get(`/diaristas/${cpf}`); 
};

// ==============================================================
// etapa 3 - Funções de Interesse e Busca de Vagas (MODIFICADAS)
// ==============================================================

// ANTES: serviçoCadastrarProposta
export function serviçoCadastrarInteresse(interesse) {
    // Rota definida em RotasDiarista.ts: post("/interesses/")
    return servidor.post("/diaristas/interesses", interesse); 
};


// REMOVIDO: serviçoAlterarProposta (Não implementamos essa lógica no backend)

// ANTES: serviçoRemoverProposta
export function serviçoRemoverInteresse(id) {
    // Rota definida em RotasDiarista.ts: delete("/interesses/:id")
    return servidor.delete(`/diaristas/interesses/${id}`); 
};

// ANTES: serviçoBuscarPropostasProfessor
export function serviçoBuscarInteressesDiarista(cpf) {
    // Rota definida em RotasDiarista.ts: get("/interesses/diarista/:cpf")
    return servidor.get(`/diaristas/interesses/diarista/${cpf}`); 
};

// ANTES: serviçoBuscarÁreasAtuaçãoPropostas
export function serviçoBuscarVagasEmprego() {
    // Rota definida em RotasDiarista.ts: get("/vagas-emprego/")
    return servidor.get("/diaristas/vagas-emprego"); 
};