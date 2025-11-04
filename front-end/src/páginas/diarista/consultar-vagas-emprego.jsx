import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber"; // <-- ADICIONADO

// CONTEXTOS MODIFICADOS
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoDiarista from "../../contextos/contexto-diarista"; // <-- MODIFICADO

import {
    estilizarBotãoRetornar, estilizarCard, estilizarCheckbox, estilizarDivCampo,
    estilizarDivider, estilizarFlex, estilizarInlineFlex, estilizarInputText, estilizarLabel,
    estilizarInputNumber // (Assumindo que este estilo existe ou será criado)
}
    from "../../utilitários/estilos";

// COMPONENTE RENOMEADO
export default function ConsultarVagaEmprego() {
    const { usuárioLogado } = useContext(ContextoUsuário);

    // CONTEXTO MODIFICADO
    const { vagaEmpregoConsultada, vagaEmpregoInteresse } = useContext(ContextoDiarista); // <-- MODIFICADO

    // DADOS MODIFICADOS (para bater com a VagaEmprego.ts)
    const dados = {
        nome_gerente: vagaEmpregoConsultada?.gerente_empresa?.usuário?.nome
            || vagaEmpregoInteresse?.gerente_empresa?.usuário?.nome,
        dia_trabalho: vagaEmpregoConsultada?.dia_trabalho || vagaEmpregoInteresse?.dia_trabalho,
        turno_trabalho: vagaEmpregoConsultada?.turno_trabalho || vagaEmpregoInteresse?.turno_trabalho,
        salário: vagaEmpregoConsultada?.salário || vagaEmpregoInteresse?.salário,
        descrição: vagaEmpregoConsultada?.descrição || vagaEmpregoInteresse?.descrição,
        urgência: vagaEmpregoConsultada?.urgência || vagaEmpregoInteresse?.urgência,
    };

    const navegar = useNavigate();

    // NAVEGAÇÃO MODIFICADA
    function retornar() {
        if (vagaEmpregoConsultada) navegar("../pesquisar-vagas-emprego"); // <-- MODIFICADO
        else if (vagaEmpregoInteresse) navegar("../cadastrar-interesse"); // (Mantido)
    };

    return (
        <div className={estilizarFlex()}>
            {/* TÍTULO MODIFICADO */}
            <Card title="Consultar Vaga de Emprego" className={estilizarCard(usuárioLogado.cor_tema)}>

                {/* CAMPO PROFESSOR -> GERENTE */}
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Gerente*:</label>
                    <InputText name="nome_gerente"
                        className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
                        value={dados.nome_gerente} disabled />
                </div>

                {/* CAMPO DESCRIÇÃO (MANTIDO) */}
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Descrição*:</label>
                    <InputTextarea name="descrição" value={dados.descrição}
                        className={estilizarInputText(null, 400, usuárioLogado.cor_tema)} autoResize disabled />
                </div>

                {/* CAMPO DIA TRABALHO (ADICIONADO) */}
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Dia de Trabalho*:</label>
                    <InputText name="dia_trabalho"
                        className={estilizarInputText(null, 200, usuárioLogado.cor_tema)}
                        value={dados.dia_trabalho} disabled />
                </div>

                {/* CAMPO TURNO TRABALHO (ADICIONADO) */}
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Turno de Trabalho*:</label>
                    <InputText name="turno_trabalho"
                        className={estilizarInputText(null, 200, usuárioLogado.cor_tema)}
                        value={dados.turno_trabalho} disabled />
                </div>

                {/* CAMPO SALÁRIO (ADICIONADO) */}
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Salário (R$)*:</label>
                    <InputNumber inputId="salário" name="salário" value={dados.salário}
                        mode="currency" currency="BRL" locale="pt-BR"
                        className={estilizarInputNumber(null, usuárioLogado.cor_tema)}
                        inputClassName={estilizarInputText(null, 200, usuárioLogado.cor_tema)}
                        disabled />
                </div>

                {/* CAMPO BOLSA -> URGÊNCIA */}
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Urgência*:</label>
                    <Checkbox name="urgência" checked={dados.urgência}
                        className={estilizarCheckbox(null)} autoResize disabled />
                </div>

                {/* REMOVIDOS: Título, Categoria, Área Atuação, Data Início, Resultado */}

                <Divider className={estilizarDivider()} />
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={retornar} />
                </div>
            </Card>
        </div>
    );
}