import servidor from "../servidor";
export function serviçoCadastrarGerenteEmpresa(gerente)
 { return servidor.post("/gerente-empresa", gerente); };
export function serviçoBuscarGerenteEmpresa(cpf) { return servidor.get(`/gerentes/${cpf}`); };