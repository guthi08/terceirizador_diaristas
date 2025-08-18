import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import Professor from "../entidades/professor";
import ServiçosUsuário from "./serviços-usuário";
export default class ServiçosProfessor {
constructor() {}
static async cadastrarProfessor(request, response) {
try {
const { usuário_info, titulação, anos_experiência_empresarial } = request.body;
const { usuário, token } = await ServiçosUsuário.cadastrarUsuário(usuário_info);
const entityManager = getManager();
await entityManager.transaction(async (transactionManager) => {
await transactionManager.save(usuário);
const professor = Professor.create({ usuário, titulação, anos_experiência_empresarial });
await transactionManager.save(professor);
await transactionManager.update(Usuário, usuário.cpf, { status: Status.ATIVO });
return response.json({ status: Status.ATIVO, token });
 });
 } catch (error) {
return response.status(500).json({ erro: error });
 }
 };
static async buscarProfessor(request, response) {
try {
const cpf_encriptado = md5(request.params.cpf);
const professor = await Professor.findOne({ where: { usuário: cpf_encriptado },
relations: ["usuário"] });
if (!professor) return response.status(404).json({ erro: "Professor não encontrado." });
return response.json({ nome: professor.usuário.nome, email: professor.usuário.email,
 titulação: professor.titulação,
 anos_experiência_empresarial: professor.anos_experiência_empresarial });
 } catch (error) { return response.status(500).json({ erro: "Erro BD : buscarProfessor" }); }
 };
};