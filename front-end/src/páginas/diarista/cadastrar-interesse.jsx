import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown"; // <-- ADICIONADO
import { InputNumber } from "primereact/inputnumber"; // <-- ADICIONADO

// CONTEXTOS MODIFICADOS
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoDiarista from "../../contextos/contexto-diarista"; // <-- MODIFICADO

// SERVIÇOS MODIFICADOS
import { serviçoCadastrarInteresse, serviçoRemoverInteresse } from "../../serviços/serviços-diarista"; // <-- MODIFICADO

import mostrarToast from "../../utilitários/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios }
    from "../../utilitários/validações";
import {
    estilizarBotão, estilizarBotãoRetornar, estilizarBotãoRemover, estilizarCard,
    estilizarCheckbox, estilizarDivCampo, estilizarDivider, estilizarFlex, estilizarInlineFlex,
    estilizarInputText, estilizarInputTextarea, estilizarLabel, estilizarInputNumber, // (estilo precisa ser criado)
    estilizarDropdown // (estilo precisa ser criado)
} from "../../utilitários/estilos";

// ADICIONADO: Opções baseadas nas ENUMs de Interesse.ts
const opçõesDia = [
    { label: "Segunda", value: "segunda" },
    { label: "Terça", value: "terça" },
    { label: "Quarta", value: "quarta" },
    { label: "Quinta", value: "quinta" },
    { label: "Sexta", value: "sexta" },
    { label: "Sábado", value: "sábado" },
    { label: "Domingo", value: "domingo" }
];

const opçõesTurno = [
    { label: "Manhã", value: "manhã" },
    { label: "Tarde", value: "tarde" },
    { label: "Noite", value: "noite" }
];


export default function CadastrarInteresse() {
    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);

    // CONTEXTO MODIFICADO
    const { interesseConsultado, vagaEmpregoSelecionada } = useContext(ContextoDiarista); // <-- MODIFICADO

    // ESTADO MODIFICADO: Adaptado para a entidade Interesse.ts
    const [dados, setDados] = useState({
        id_vaga: vagaEmpregoSelecionada?.id || interesseConsultado?.vaga_emprego?.id || null, // <-- MODIFICADO
        dia_trabalho: interesseConsultado?.dia_trabalho || "", // <-- ADICIONADO
        turno: interesseConsultado?.turno || "", // <-- ADICIONADO
        valor_diária: interesseConsultado?.valor_diária || 0, // <-- ADICIONADO
        prontidão: interesseConsultado?.prontidão || false, // <-- MODIFICADO (era necessidade_bolsa)
        justificativa: interesseConsultado?.justificativa || "" // <-- MANTIDO
    });

    const [erros, setErros] = useState({});
    const navegar = useNavigate();

    function alterarEstado(e) {
        // 'e' pode ser o evento do React (e.target) 
        // ou o evento do InputNumber (e.value)

        if (e.target) {
            // Caso 1: É um evento React padrão (Dropdown, InputTextarea, Checkbox)
            const { name, value, checked, type } = e.target;

            // Se for um checkbox, usa 'checked', senão usa 'value'
            const valorFinal = (type === 'checkbox') ? checked : value;

            setDados({ ...dados, [name]: valorFinal });

        } else if (e.value !== undefined) {
            // Caso 2: É um evento do InputNumber (Valor Diária Pretendido)
            // O InputNumber não tem 'e.target', só 'e.value'.
            // Precisamos setar 'valor_diária' manualmente.
            setDados({ ...dados, valor_diária: e.value });
        }
    };

    // VALIDAÇÃO MODIFICADA
    function validarCampos() {
        const { id_vaga, dia_trabalho, turno, valor_diária, justificativa } = dados;
        let errosCamposObrigatórios = validarCamposObrigatórios({
            id_vaga,
            dia_trabalho,
            turno,
            valor_diária,
            justificativa
        });
        setErros(errosCamposObrigatórios);
        return checarListaVazia(errosCamposObrigatórios);
    };

    // NOMES MODIFICADOS
    function vagaLabel() {
        if (interesseConsultado?.vaga_emprego || vagaEmpregoSelecionada)
            return "Vaga Selecionada*:";
        else return "Selecione uma Vaga*:";
    };

    function pesquisarVagas() { navegar("../pesquisar-vagas-emprego"); }; // <-- MODIFICADO
    function retornarAdministrarInteresses() { navegar("../administrar-interesses"); };

    async function cadastrarInteresse() {
        if (validarCampos()) {
            try {
                // SERVIÇO MODIFICADO
                await serviçoCadastrarInteresse({ ...dados, cpf: usuárioLogado.cpf });
                mostrarToast(referênciaToast, "Interesse cadastrado com sucesso!", "sucesso"); // <-- (sucesso)
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); } // <-- (erro)
        }
    };

    async function removerInteresse() {
        try {
            // SERVIÇO MODIFICADO
            await serviçoRemoverInteresse(interesseConsultado.id);
            mostrarToast(referênciaToast, "Interesse removido com sucesso!", "sucesso"); // <-- (sucesso)
        } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); } // <-- (erro)
    };

    // Lógica dos botões (Mantida)
    function BotõesAções() {
        if (interesseConsultado) {
            return (
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                        onClick={retornarAdministrarInteresses} />
                    <Button className={estilizarBotãoRemover()} label="Remover" onClick={removerInteresse} />
                </div>
            );
        } else {
            return (
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                        onClick={retornarAdministrarInteresses} />
                    <Button className={estilizarBotão()} label="Cadastrar" onClick={cadastrarInteresse} />
                </div>
            );
        }
    };

    function títuloFormulário() {
        if (interesseConsultado) return "Remover Interesse";
        else return "Cadastrar Interesse";
    };

    // INPUT MODIFICADO (agora usa 'descrição' da vaga)
    function VagaInputText() {
        const desc = vagaEmpregoSelecionada?.descrição || interesseConsultado?.vaga_emprego?.descrição || "";
        if (desc) {
            return <InputText name="descrição_vaga"
                className={estilizarInputText(erros.id_vaga, 400, usuárioLogado.cor_tema)}
                value={desc} disabled />
        } else return null;
    };

    function BotãoSelecionar() {
        if (!vagaEmpregoSelecionada && !interesseConsultado) {
            return <Button className={estilizarBotão()} label="Selecionar" onClick={pesquisarVagas} />
        } else if (vagaEmpregoSelecionada) {
            return <Button className={estilizarBotão()} label="Substituir" onClick={pesquisarVagas} />;
        } else return null;
    };

    return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} onHide={retornarAdministrarInteresses} position="bottom-center" />
            <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>

                {/* CAMPO VAGA (MODIFICADO) */}
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>{vagaLabel()}</label>
                    <BotãoSelecionar />
                    <VagaInputText />
                    <MostrarMensagemErro mensagem={erros.id_vaga} />
                </div>

                {/* CAMPO DIA TRABALHO (ADICIONADO) */}
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Dia de Interesse*:</label>
                    <Dropdown name="dia_trabalho" value={dados.dia_trabalho} options={opçõesDia}
                        onChange={alterarEstado} placeholder="Selecione o dia"
                        className={estilizarDropdown(erros.dia_trabalho, usuárioLogado.cor_tema)}
                    />
                    <MostrarMensagemErro mensagem={erros.dia_trabalho} />
                </div>

                {/* CAMPO TURNO (ADICIONADO) */}
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Turno de Interesse*:</label>
                    <Dropdown name="turno" value={dados.turno} options={opçõesTurno}
                        onChange={alterarEstado} placeholder="Selecione o turno"
                        className={estilizarDropdown(erros.turno, usuárioLogado.cor_tema)}
                    />
                    <MostrarMensagemErro mensagem={erros.turno} />
                </div>

                {/* CAMPO VALOR DIÁRIA (ADICIONADO) */}
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Valor Diária Pretendido (R$)*:</label>
                    <InputNumber inputId="valor_diária" name="valor_diária" value={dados.valor_diária}
                        onValueChange={alterarEstado} mode="currency" currency="BRL" locale="pt-BR"
                        className={estilizarInputNumber(erros.valor_diária, usuárioLogado.cor_tema)}
                    />
                    <MostrarMensagemErro mensagem={erros.valor_diária} />
                </div>

                {/* CAMPO PRONTIDÃO (MODIFICADO) */}
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Prontidão (início imediato)*:</label>
                    <Checkbox name="prontidão" checked={dados.prontidão}
                        className={estilizarCheckbox()} onChange={alterarEstado} />
                </div>

                {/* CAMPO JUSTIFICATIVA (MANTIDO) */}
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Justificativa*:</label>
                    <InputTextarea name="justificativa" value={dados.justificativa}
                        className={estilizarInputTextarea(erros.justificativa, usuárioLogado.cor_tema)}
                        onChange={alterarEstado} autoResize cols={40} />
                    <MostrarMensagemErro mensagem={erros.justificativa} />
                </div>

                <Divider className={estilizarDivider()} />
                <BotõesAções />
            </Card>
        </div>
    );
}