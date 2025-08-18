import servidor from "./servidor";
export function serviçoCadastrarProfessor(professor)
 { return servidor.post("/professores", professor); };
export function serviçoBuscarProfessor(cpf) { return servidor.get(`/professores/${cpf}`); };