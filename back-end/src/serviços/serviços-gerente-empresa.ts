import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import GerenteEmpresa from "../entidades/gerente-empresa";
import ServiçosUsuário from "./serviços-usuário";

// etapa 3 
import VagaEmprego from "../entidades/vaga-emprego";

export default class ServiçosGerenteEmpresa {
  constructor() { }

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
      const gerente_empresa = await GerenteEmpresa.findOne({
        where: { usuário: cpf_encriptado },
        relations: ["usuário"]
      });
      if (!gerente_empresa) return response.status(404).json({ erro: "Gerente não encontrado." });
      return response.json({
        nome: gerente_empresa.usuário.nome,
        email: gerente_empresa.usuário.email,
        titulação: gerente_empresa.titulação,
        anos_experiência_empresarial: gerente_empresa.anos_experiência_empresarial
      });
    } catch (error) { return response.status(500).json({ erro: "Erro BD : buscarGerente" }); }
  };


  static async atualizarGerenteEmpresa(request, response) {
    try {
      const { cpf, titulação, anos_experiência_empresarial } = request.body;
      const cpf_encriptado = md5(cpf);
      await GerenteEmpresa.update(
        { usuário: { cpf: cpf_encriptado } },
        { titulação, anos_experiência_empresarial }
      );
      return response.json();
    } catch (error) { return response.status(500).json({ erro: "Erro BD : atualizarGerente" }); }
  };


  static async cadastrarVagaEmprego(request, response) {
    try {
      // MODIFICADO: Trocamos os atributos antigos pelos do seu PDF 
      const { dia_trabalho, turno_trabalho, descrição, salário, urgência, cpf } = request.body;
      const cpf_encriptado = md5(cpf);
      const gerente_empresa = await GerenteEmpresa.findOne({
        where: { usuário: cpf_encriptado },
        relations: ["usuário"]
      });

      if (!gerente_empresa)
        return response.status(404).json({ erro: "Gerente não encontrado." });

      // MODIFICADO: Usamos os novos atributos para criar a VagaEmprego 
      await VagaEmprego.create({
        dia_trabalho,
        turno_trabalho,
        descrição,
        salário,
        urgência,
        gerente_empresa
      }).save();

      return response.json();
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD : cadastrarVagaEmprego" });
    }
  };

  static async alterarVagaEmprego(request, response) {
    try {
       
      const { id, dia_trabalho, turno_trabalho, descrição, salário, urgência } = request.body;

      // MODIFICADO: Usamos os novos atributos para atualizar a VagaEmprego 
      await VagaEmprego.update(id, {
        dia_trabalho,
        turno_trabalho,
        descrição,
        salário,
        urgência
      });
      return response.json();
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD : alterarVagaEmprego" });
    }
  };

  
  static async removerVagaEmprego(request, response) {
    try {
      const id_vaga = request.params.id;
      const vaga = await VagaEmprego.findOne(id_vaga);
      if (!vaga) return response.status(404).json({ erro: "Vaga de emprego não encontrada." });
      await VagaEmprego.remove(vaga);
      return response.json();
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD : removerVagaEmprego" });
    }
  };

  // Este método está CORRETO. A lógica de busca não muda.
  static async buscarVagasGerenteEmpresa(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const vagas = await VagaEmprego.find({
        where: { gerente_empresa: { usuário: cpf_encriptado } },
        relations: ["gerente_empresa", "gerente_empresa.usuário"]
      });
      return response.json(vagas);
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD : buscarVagasGerenteEmpresa" });
    }
  };

}