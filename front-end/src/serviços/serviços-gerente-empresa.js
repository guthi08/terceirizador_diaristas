import servidor from "./servidor";

// ===========================================
// Funções para GERENCIAR o próprio Gerente
// ===========================================

// (Esta função estava CORRETA)
export function serviçoCadastrarGerenteEmpresa(gerente_empresa)
   { return servidor.post("/gerentes-empresa", gerente_empresa); };

// (Esta função estava CORRETA)
export function serviçoBuscarGerenteEmpresa(cpf) { 
    return servidor.get(`/gerentes-empresa/${cpf}`); 
};

// (Esta função estava CORRETA)
export function serviçoAtualizarGerenteEmpresa(gerente_empresa)
{ return servidor.patch("/gerentes-empresa", gerente_empresa); };

// ===========================================
// Funções para GERENCIAR as Vagas de Emprego
// (Substituindo as de 'Propostas')
// ===========================================

// ANTES: serviçoCadastrarProposta
export function serviçoCadastrarVagaEmprego(vaga_emprego) {
    // ANTES: /professores/propostas
    return servidor.post("/gerentes-empresa/vagas-emprego", vaga_emprego); 
};

// ANTES: serviçoAlterarProposta
export function serviçoAlterarVagaEmprego(vaga_emprego) {
    // ANTES: /professores/propostas
    return servidor.patch("/gerentes-empresa/vagas-emprego", vaga_emprego); 
};

// ANTES: serviçoRemoverProposta
export function serviçoRemoverVagaEmprego(id) {
    // ANTES: /professores/propostas/:id
    return servidor.delete(`/gerentes-empresa/vagas-emprego/${id}`); 
};


export function serviçoBuscarVagasGerenteEmpresa(cpf) {
   
    return servidor.get(`/gerentes-empresa/vagas-emprego/gerente/${cpf}`); 
};
