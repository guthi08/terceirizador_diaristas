import servidor from "./servidor";

// tudo onde tem "diaristas" antes era "alunos"
export function serviçoCadastrarDiarista(diarista) { return servidor.post("/diaristas", diarista); };
export function serviçoAtualizarDiarista(diarista) { return servidor.patch("/diaristas", diarista); };
export function serviçoBuscarDiarista(cpf) { return servidor.get(`/diaristas/${cpf}`); };