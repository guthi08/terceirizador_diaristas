import md5 from "md5";
import { getManager } from "typeorm";

import Usuário, { Status } from "../entidades/usuário";
import GerenteEmpresa from "../entidades/gerente-empresa";
import ServiçosUsuário from "./serviços-usuário";

export default class ServiçosGerenteEmpresa {
constructor() {}
static async cadastrarGerenteEmpresa(request, response) {
    try {
        const { usuário_info, titulação, anos_experiência_empresarial } = request.body;
        const { usuário, token } = await ServiçosUsuário.cadastrarUsuário(usuário_info);
        const entityManager = getManager();
        await entityManager.transaction(async (transactionManager) => {
        await transactionManager.save(usuário);
        const gerente_empresa = GerenteEmpresa.create({ usuário, titulação, anos_experiência_empresarial });
        await transactionManager.save(gerente_empresa);
        await transactionManager.update(Usuário, usuário.cpf, { status: Status.ATIVO });
        return response.json({ status: Status.ATIVO, token });
        });
    } catch (error) {
    return response.status(500).json({ erro: error });
     }
     };
     
    static async buscarGerenteEmpresa(request, response) {
    try {
    const cpf_encriptado = md5(request.params.cpf);
    const gerente_empresa = await GerenteEmpresa.findOne({ where: { usuário: cpf_encriptado },
    relations: ["usuário"] });
    if (!gerente_empresa) return response.status(404).json({ erro: "Gerente não encontrado." });
    return response.json({ nome: gerente_empresa.usuário.nome, email: gerente_empresa.usuário.email,
    titulação: gerente_empresa.titulação,
    anos_experiência_empresarial: gerente_empresa.anos_experiência_empresarial });
    } catch (error) { return response.status(500).json({ erro: "Erro BD : buscarGerente Empresa" }); }
    };
};