import servidor from "./servidor";
export function serviçoCadastrarGerenteEmpresa(gerente_empresa)
   { return servidor.post("/gerentes-empresa", gerente_empresa); };
export function serviçoBuscarGerenteEmpresa(cpf) { return servidor.get(`/gerentes-empresa/${cpf}`); };

//add na etapa 2 
export function serviçoAtualizarGerenteEmpresa(gerente_empresa) //de professor para gerente_empresa
{ return servidor.patch("/gerentes-empresa", gerente_empresa); }; //de Professores para gerentes-empresa