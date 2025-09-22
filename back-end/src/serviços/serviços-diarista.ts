import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import Diarista from '../entidades/diarista';
import ServiçosUsuário from "./serviços-usuário";

export default class ServiçosDiarista {

    constructor() { }
    static async cadastrarDiarista(request, response) {
        try {
            const { usuário_info, data_nascimento, área_atuação, tempo_experiência_área } = request.body; //verificar isso aqui depois
            const { usuário, token } = await ServiçosUsuário.cadastrarUsuário(usuário_info);
            const entityManager = getManager();

            
            await entityManager.transaction(async (transactionManager) => {
                await transactionManager.save(usuário);
                const diarista = Diarista.create({ usuário, área_atuação, tempo_experiência_área, data_nascimento }); //removi curso, ano_ingresso e add area_atuacao e tempo_experiencia_area
                await transactionManager.save(Diarista);
                await transactionManager.update(Usuário, usuário.cpf, { status: Status.ATIVO });
                return response.json({ status: Status.ATIVO, token });
            });
        } catch (error) { return response.status(500).json({ erro: error }); }
    };



    static async atualizarDiarista(request, response) {
        try {
            const { cpf, área_atuação, tempo_experiência_área, data_nascimento } = request.body;
            const cpf_encriptado = md5(cpf);
            await Diarista.update({ usuário: { cpf: cpf_encriptado } }, {
                área_atuação, tempo_experiência_área,
                data_nascimento
            });
            return response.json();
        } catch (error) { return response.status(500).json({ erro: "Erro BD : atualizarDiarista" }); }
    };



    static async buscarDiarista(request, response) {
        try {
            const cpf_encriptado = md5(request.params.cpf);
            const diarista = await Diarista.findOne({
                where: { usuário: cpf_encriptado },
                relations: ["usuário"]
            });
            if (!diarista) return response.status(404).json({ erro: "Diarista não encontrado." });
            return response.json({
                nome: diarista.usuário.nome, email: diarista.usuário.email,
                área_atuação: diarista.área_atuação, tempo_experiência_área: diarista.tempo_experiência_área,
                data_nascimento: diarista.data_nascimento
            });
        } catch (error) { return response.status(500).json({ erro: "Erro BD : buscarDiarista" }); }
    };
}