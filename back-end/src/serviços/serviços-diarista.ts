import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import Diarista from '../entidades/diarista';
import ServiçosUsuário from "./serviços-usuário";

import VagaEmprego from "../entidades/vaga-emprego";
import Interesse from "../entidades/interesse";

export default class ServiçosDiarista {

    constructor() { }

    // (Estes métodos já estavam CORRETOS e batem com a entidade Diarista.ts)
    static async cadastrarDiarista(request, response) {
        // ... (código 100% correto, sem alterações)
        try {
            console.log("BACK-END [cadastrarDiarista]: TENTANDO CADASTRAR. Dados recebidos:", request.body);
            const { usuário_info, data_nascimento, área_atuação, tempo_experiência_área } = request.body;
            const { usuário, token } = await ServiçosUsuário.cadastrarUsuário(usuário_info);
            const entityManager = getManager();

            await entityManager.transaction(async (transactionManager) => {
                await transactionManager.save(usuário);
                const diarista = Diarista.create({
                    usuário,
                    área_atuação,
                    tempo_experiência_área,
                    data_nascimento
                });
                await transactionManager.save(diarista);
                await transactionManager.update(Usuário, usuário.cpf, { status: Status.ATIVO });
                console.log("BACK-END [cadastrarDiarista]: SUCESSO! Diarista salvo.");
                return response.json({ status: Status.ATIVO, token });
            });
        } catch (error) {
            console.error("BACK-END [cadastrarDiarista]: ERRO NO CATCH:", error);
            return response.status(500).json({ erro: error });
        }
    };

    
    


    static async atualizarDiarista(request, response) {
        // ... (código 100% correto, sem alterações)
        try {
            const { cpf, área_atuação, tempo_experiência_área, data_nascimento } = request.body;
            const cpf_encriptado = md5(cpf);
            await Diarista.update({ usuário: { cpf: cpf_encriptado } }, {
                área_atuação, tempo_experiência_área,
                data_nascimento
            });
            return response.json();
        } catch (error) {
            return response.status(500).json({ erro: "Erro BD : atualizarDiarista" });
        }
    };

    static async buscarDiarista(request, response) {

        try {
            const cpf_encriptado = md5(request.params.cpf);
            console.log("BACK-END [buscarDiarista]: Buscando CPF (encriptado):", cpf_encriptado);


            const diarista = await Diarista.findOne({
                where: { usuário: { cpf: cpf_encriptado } }, // <--- ESTA É A CORREÇÃO
                relations: ["usuário"]
            });



            console.log("BACK-END [buscarDiarista]: Resultado da busca no DB:", diarista);


            if (!diarista) {
                console.log("BACK-END [buscarDiarista]: Diarista NÃO encontrado. Retornando 404.");
                return response.status(404).json({ erro: "Diarista não encontrado." });
            }
            console.log("BACK-END [buscarDiarista]: Diarista ENCONTRADO:", diarista.usuário.nome);
            return response.json({
                nome: diarista.usuário.nome,
                email: diarista.usuário.email,
                área_atuação: diarista.área_atuação,
                tempo_experiência_área: diarista.tempo_experiência_área,
                data_nascimento: diarista.data_nascimento
            });
        } catch (error) {
            console.error("BACK-END [buscarDiarista]: ERRO NO CATCH:", error);
            return response.status(500).json({ erro: "Erro BD : buscarDiarista" });
        }
    };



    static async cadastrarInteresse(request, response) {
        try {

            const { id_vaga, cpf, dia_trabalho, prontidão, turno, valor_diária, justificativa } = request.body;
            const cpf_encriptado = md5(cpf);

            const diarista = await Diarista.findOne({
                where: { usuário: { cpf: cpf_encriptado } },
                relations: ["usuário"]
            });

            if (!diarista) return response.status(404).json({ erro: "Diarista não encontrado." });

            const vaga = await VagaEmprego.findOne(id_vaga);
            if (!vaga) return response.status(404).json({ erro: "Vaga de emprego não encontrada." });

            const interesses = await Interesse.find({ where: { diarista, vaga_emprego: vaga } });
            if (interesses.length > 0) {
                return response.status(400).json({ erro: "O diarista já cadastrou interesse para esta vaga." });
            }

            // MODIFICADO: Atributos ajustados para a ENTIDADE
            await Interesse.create({
                dia_trabalho,  // <--- AJUSTADO
                justificativa, // <--- AJUSTADO
                prontidão,
                turno, // <--- AJUSTADO
                valor_diária,
                diarista,
                vaga_emprego: vaga
            }).save();

            return response.json();
        } catch (error) {
            return response.status(500).json({ erro: "Erro BD : cadastrarInteresse" });

        }
    };

    // (Estes métodos já estavam CORRETOS)
    static async removerInteresse(request, response) {
        // ... (código 100% correto, sem alterações)
        try {
            const id = request.params.id;
            await Interesse.delete(id);
            return response.json();

        } catch (error) {
            return response.status(500).json({ erro: "Erro BD : removerInteresse" });
        }
    };

    static async buscarInteressesDiarista(request, response) {
        // ... (código 100% correto, sem alterações)
        try {
            const cpf_encriptado = md5(request.params.cpf);
            const interesses = await Interesse.find({
                where: { diarista: { usuário: cpf_encriptado } },
                relations: [
                    "diarista",
                    "diarista.usuário",
                    "vaga_emprego",
                    "vaga_emprego.gerente_empresa",
                    "vaga_emprego.gerente_empresa.usuário"
                ]
            });
            return response.json(interesses);
        } catch (error) {
            return response.status(500).json({ erro: "Erro BD : buscarInteressesDiarista" });
        }
    };

    static async buscarVagasEmprego(request, response) {
        // ... (código 100% correto, o nome já estava ajustado)
        try {
            const vagas = await VagaEmprego.find({
                relations: ["gerente_empresa", "gerente_empresa.usuário"]
            });
            return response.json(vagas);
        } catch (error) {
            return response.status(500).json({ erro: "Erro BD : buscarVagas" });

        }
    };
}