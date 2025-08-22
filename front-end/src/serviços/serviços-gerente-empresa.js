import servidor from "../servidor";
export function serviçoCadastrarGerenteEmpresa(gerente)
 { return servidor.post("/gerentes", gerente); };
export function serviçoBuscarGerenteEmpresa(cpf) { return servidor.get(`/gerentes/${cpf}`); };