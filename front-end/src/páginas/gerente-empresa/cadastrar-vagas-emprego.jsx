import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber"; // <-- ADICIONADO

// CONTEXTOS MODIFICADOS
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoGerenteEmpresa from "../../contextos/contexto-gerente-empresa"; // <-- MODIFICADO

// SERVIÇOS MODIFICADOS
import {
    serviçoAlterarVagaEmprego, serviçoCadastrarVagaEmprego, serviçoRemoverVagaEmprego
} from "../../serviços/serviços-gerente-empresa"; // <-- MODIFICADO

import mostrarToast from "../../utilitários/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios }
    from "../../utilitários/validações";
import {
    estilizarBotão, estilizarBotãoRemover, estilizarBotãoRetornar, estilizarCard,
    estilizarCheckbox, estilizarDivCampo, estilizarDivider, estilizarDropdown, estilizarFlex,
    estilizarInlineFlex, estilizarInputTextarea, estilizarLabel,
    estilizarInputNumber // (Assumindo que este estilo existe ou será criado)
}
    from "../../utilitários/estilos";

// COMPONENTE RENOMEADO
export default function CadastrarVagaEmprego() {
    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);

    // CONTEXTO MODIFICADO
    const { vagaEmpregoConsultada } = useContext(ContextoGerenteEmpresa); // <-- MODIFICADO

    // ESTADO MODIFICADO (para VagaEmprego.ts)
    const [dados, setDados] = useState({
        dia_trabalho: vagaEmpregoConsultada?.dia_trabalho || "",
        turno_trabalho: vagaEmpregoConsultada?.turno_trabalho || "",
        descrição: vagaEmpregoConsultada?.descrição || "",
        salário: vagaEmpregoConsultada?.salário || 0,
        urgência: vagaEmpregoConsultada?.urgência || false
    });

    const [erros, setErros] = useState({});
    const navegar = useNavigate();

    // ADICIONADO: Opções baseadas na entidade VagaEmprego.ts
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
        { label: "Vespertino", value: "vespertino" },
        { label: "Noturno", value: "noturno" },
        { label: "Integral", value: "integral" }
    ];

    // FUNÇÃO MODIFICADA: para lidar com Checkbox, Dropdown e InputNumber
    /*function alterarEstado(event) {
        const chave = event.target.name || event.target.id;
        let valor;
        if (event.value !== undefined) {
            valor = event.value; // Para Dropdown e InputNumber
        } else if (event.checked !== undefined) {
            valor = event.checked; // Para Checkbox
        } else {
            valor = event.target.value; // Para InputTextarea
        }
        setDados({ ...dados, [chave]: valor });
    };
    */
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
            // Caso 2: É um evento do InputNumber (Salário)
            // O InputNumber envia { value: ... } e não tem 'e.target'
            setDados({ ...dados, salário: e.value });
        }
    };
    // FUNÇÃO MODIFICADA: para validar campos da VagaEmprego
    function validarCampos() {
        const { dia_trabalho, turno_trabalho, descrição, salário } = dados;
        let errosCamposObrigatórios = validarCamposObrigatórios({
            dia_trabalho, turno_trabalho, descrição, salário
        });
        // Validação extra para salário
        if (salário <= 0) {
            errosCamposObrigatórios.salário = "O salário deve ser maior que zero.";
        }
        setErros(errosCamposObrigatórios);
        return checarListaVazia(errosCamposObrigatórios);
    };

    function retornarAdministrarVagasEmprego() { navegar("../administrar-vagas-emprego"); }; // <-- MODIFICADO

    // FUNÇÃO MODIFICADA
    async function cadastrarVagaEmprego() {
        if (validarCampos()) {
            try {
                // SERVIÇO MODIFICADO
                await serviçoCadastrarVagaEmprego({ ...dados, cpf: usuárioLogado.cpf });
                mostrarToast(referênciaToast, "Vaga de emprego cadastrada com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
        }
    };

    // FUNÇÃO MODIFICADA
    async function alterarVagaEmprego() {
        if (validarCampos()) {
            try {
                // SERVIÇO MODIFICADO
                await serviçoAlterarVagaEmprego({ ...dados, id: vagaEmpregoConsultada.id });
                mostrarToast(referênciaToast, "Vaga de emprego alterada com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
        }
    };

    // FUNÇÃO MODIFICADA
    async function removerVagaEmprego() {
        try {
            // SERVIÇO MODIFICADO
            await serviçoRemoverVagaEmprego(vagaEmpregoConsultada.id);
            mostrarToast(referênciaToast, "Vaga de emprego excluída com sucesso!", "sucesso");
        } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
    };

    function BotõesAções() {
        if (vagaEmpregoConsultada) { // <-- MODIFICADO
            return (
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                        onClick={retornarAdministrarVagasEmprego} />
                    <Button className={estilizarBotãoRemover()} label="Remover" onClick={removerVagaEmprego} />
                    <Button className={estilizarBotão()} label="Alterar" onClick={alterarVagaEmprego} />
                </div>
            );
        } else {
            return (
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                        onClick={retornarAdministrarVagasEmprego} /> //
                    <Button className={estilizarBotão()} label="Cadastrar" onClick={cadastrarVagaEmprego} />
                </div>
            );
        }
    };

    function títuloFormulário() {
        if (vagaEmpregoConsultada) return "Alterar Vaga de Emprego"; // <-- MODIFICADO
        else return "Cadastrar Vaga de Emprego"; // <-- MODIFICADO
    };

    // REMOVIDO: useEffect que buscava 'listaÁreasAtuação'

    return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} onHide={retornarAdministrarVagasEmprego} position="bottom-center" />
            <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>

                {/* CAMPO DESCRIÇÃO (MANTIDO, MAS MOVIDO PARA CIMA) */}
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Descrição*:</label>
                    <InputTextarea name="descrição" value={dados.descrição}
                        className={estilizarInputTextarea(erros.descrição, usuárioLogado.cor_tema)}
                        onChange={alterarEstado} autoResize cols={40} />
                    <MostrarMensagemErro mensagem={erros.descrição} />
                </div>

                {/* CAMPO DIA TRABALHO (ADICIONADO) */}
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Dia de Trabalho*:</label>
                    <Dropdown name="dia_trabalho"
                        className={estilizarDropdown(erros.dia_trabalho, usuárioLogado.cor_tema)}
                        value={dados.dia_trabalho} options={opçõesDia} onChange={alterarEstado}
                        placeholder="-- Selecione --" />
                    <MostrarMensagemErro mensagem={erros.dia_trabalho} />
                </div>

                {/* CAMPO TURNO TRABALHO (ADICIONADO) */}
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Turno de Trabalho*:</label>
                    <Dropdown name="turno_trabalho"
                        className={estilizarDropdown(erros.turno_trabalho, usuárioLogado.cor_tema)}
                        value={dados.turno_trabalho} options={opçõesTurno} onChange={alterarEstado}
                        placeholder="-- Selecione --" />
                    <MostrarMensagemErro mensagem={erros.turno_trabalho} />
                </div>

                {/* CAMPO SALÁRIO (ADICIONADO) */}
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Salário (R$)*:</label>
                    <InputNumber inputId="salário" name="salário" value={dados.salário}
                        onValueChange={alterarEstado} mode="currency" currency="BRL" locale="pt-BR"
                        className={estilizarInputNumber(erros.salário, usuárioLogado.cor_tema)}
                    />
                    <MostrarMensagemErro mensagem={erros.salário} />
                </div>

                {/* CAMPO URGÊNCIA (MODIFICADO) */}
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Urgência*:</label>
                    <Checkbox inputId="urgência" name="urgência" checked={dados.urgência}
                        className={estilizarCheckbox()} onChange={alterarEstado} />
                </div>

                {/* CAMPOS REMOVIDOS: Título, Categoria, Áreas Atuação, Data Início, Resultado */}

                <Divider className={estilizarDivider()} />
                <BotõesAções />
            </Card>
        </div>
    );
}