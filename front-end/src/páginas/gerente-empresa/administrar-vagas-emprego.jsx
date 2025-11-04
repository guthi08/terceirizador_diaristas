import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { TriStateCheckbox } from "primereact/tristatecheckbox";

// CONTEXTOS MODIFICADOS
import ContextoGerenteEmpresa from "../../contextos/contexto-gerente-empresa"; // <-- MODIFICADO
import ContextoUsuário from "../../contextos/contexto-usuário";

// SERVIÇO MODIFICADO
import { serviçoBuscarVagasGerenteEmpresa } from "../../serviços/serviços-gerente-empresa"; // <-- MODIFICADO

import mostrarToast from "../../utilitários/mostrar-toast";
import {
    TAMANHOS, estilizarBotão, estilizarBotãoRetornar, estilizarBotãoTabela, estilizarCard,
    estilizarColunaConsultar, estilizarColumnHeader, estilizarDataTable, estilizarDataTablePaginator,
    estilizarDivider, estilizarFilterMenu, estilizarFlex, estilizarTriStateCheckbox
}
    from "../../utilitários/estilos";

// COMPONENTE RENOMEADO
export default function AdministrarVagasEmprego() {
    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);

    // CONTEXTO MODIFICADO
    const { vagaEmpregoConsultada, setVagaEmpregoConsultada } = useContext(ContextoGerenteEmpresa); // <-- MODIFICADO

    // ESTADO MODIFICADO
    const [listaVagasEmprego, setListaVagasEmprego] = useState([]); // <-- MODIFICADO
    const navegar = useNavigate();

    // REMOVIDO: 'opçõesCategoria' e 'DropdownÁreaTemplate' não se aplicam.

    function retornarPáginaInicial() { navegar("/pagina-inicial"); };

    // FUNÇÃO MODIFICADA
    function adicionarVagaEmprego() {
        setVagaEmpregoConsultada(null); // <-- MODIFICADO
        navegar("../cadastrar-vaga-emprego"); // <-- MODIFICADO
    };

    function ConsultarTemplate(vagaEmprego) { // <-- MODIFICADO
        function consultar() {
            setVagaEmpregoConsultada(vagaEmprego); // <-- MODIFICADO
            navegar("../cadastrar-vaga-emprego"); // <-- MODIFICADO
        };
        return (
            <Button icon="pi pi-search"
                className={estilizarBotãoTabela(usuárioLogado.cor_tema,
                    vagaEmpregoConsultada?.id === vagaEmprego.id)} // <-- MODIFICADO
                tooltip="Consultar Vaga de Emprego" tooltipOptions={{ position: 'top' }} onClick={consultar} /> // <-- MODIFICADO
        );
    };

    // ADICIONADO: Template para formatar Salário
    function CurrencyBodyTemplate(vaga) {
        const valor = vaga.salário;
        if (valor === null || valor === undefined) return null;
        return valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    };

    // MODIFICADO: Adaptado de 'concorrendo_bolsa' para 'urgência'
    function BooleanBodyTemplate(vagaEmprego) {
        if (vagaEmprego.urgência) return "Sim"; // <-- MODIFICADO
        else return "Não";
    };

    // MODIFICADO: Adaptado de 'concorrendo_bolsa' para 'urgência'
    function BooleanFilterTemplate(opções) {
        function alterarFiltroTriState(event) { return opções.filterCallback(event.value); };
        return (
            <div>
                <label>Urgência:</label> {/* <-- MODIFICADO */}
                <TriStateCheckbox
                    className={estilizarTriStateCheckbox(usuárioLogado?.cor_tema)} value={opções.value}
                    onChange={alterarFiltroTriState} />
            </div>
        );
    };

    useEffect(() => {
        let desmontado = false;
        // FUNÇÃO MODIFICADA
        async function buscarVagasGerenteEmpresa() { // <-- MODIFICADO
            try {
                // SERVIÇO MODIFICADO
                const response = await serviçoBuscarVagasGerenteEmpresa(usuárioLogado.cpf); // <-- MODIFICADO
                if (!desmontado && response.data) { setListaVagasEmprego(response.data); } // <-- MODIFICADO
            } catch (error) {
                const erro = error.response?.data?.erro; // (Melhoria na checagem de erro)
                if (erro) mostrarToast(referênciaToast, erro, "error");
            }
        };
        buscarVagasGerenteEmpresa(); // <-- MODIFICADO
        return () => desmontado = true;
    }, [usuárioLogado.cpf]);

    return (
        <div className={estilizarFlex()}>
            {/* TÍTULO MODIFICADO */}
            <Card title="Administrar Vagas de Emprego" className={estilizarCard(usuárioLogado.cor_tema)}>
                <DataTable dataKey="id" size="small" paginator rows={TAMANHOS.MAX_LINHAS_TABELA}
                    emptyMessage="Nenhuma vaga de emprego encontrada." value={listaVagasEmprego} // <-- MODIFICADO
                    responsiveLayout="scroll" breakpoint="490px" removableSort
                    className={estilizarDataTable()}
                    paginatorClassName={estilizarDataTablePaginator(usuárioLogado.cor_tema)}>

                    {/* Coluna de Consulta (Mantida) */}
                    <Column bodyClassName={estilizarColunaConsultar()} body={ConsultarTemplate}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} />

                    {/* MODIFICADO: de 'título' para 'descrição' */}
                    <Column field="descrição" header="Descrição" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />

                    {/* REMOVIDO: Coluna 'Categoria' */}
                    {/* REMOVIDO: Coluna 'Área de Atuação' */}

                    {/* ADICIONADO: Coluna para Salário */}
                    <Column field="salário" header="Salário (R$)" body={CurrencyBodyTemplate}
                        dataType="numeric"
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />

                    {/* ADICIONADO: Coluna para Dia */}
                    <Column field="dia_trabalho" header="Dia" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />

                    {/* ADICIONADO: Coluna para Turno */}
                    <Column field="turno_trabalho" header="Turno" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />

                    {/* MODIFICADO: de 'concorrendo_bolsa' para 'urgência' */}
                    <Column field="urgência" header="Urgência" filter
                        showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable
                        filterMatchMode="equals" filterElement={BooleanFilterTemplate}
                        body={BooleanBodyTemplate} showClearButton={false} showAddButton={false}
                        filterMenuClassName={estilizarFilterMenu()} dataType="boolean" />
                </DataTable>
                <Divider className={estilizarDivider()} />
                <Button className={estilizarBotãoRetornar()} label="Retornar"
                    onClick={retornarPáginaInicial} />

                {/* BOTÃO MODIFICADO */}
                <Button className={estilizarBotão()} label="Adicionar" onClick={adicionarVagaEmprego} />
            </Card>
        </div>
    );
}