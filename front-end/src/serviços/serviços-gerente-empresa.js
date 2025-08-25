import servidor from "./servidor";


export function serviçoCadastrarGerenteEmpresa(gerente_empresa)

{ return servidor.post("/gerentes-empresa", gerente_empresa); };

export function serviçoBuscarGerenteEmpresa(cpf) { return servidor.get(`/gerentes-empresa/${cpf}`); };