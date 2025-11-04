import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { TriStateCheckbox } from "primereact/tristatecheckbox";

// CONTEXTOS MODIFICADOS
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoDiarista from "../../contextos/contexto-diarista"; // <-- MODIFICADO

// SERVIÇO MODIFICADO
import { serviçoBuscarVagasEmprego } from "../../serviços/serviços-diarista"; // <-- MODIFICADO

import mostrarToast from "../../utilitários/mostrar-toast";
import {
    TAMANHOS, estilizarBotãoRetornar, estilizarBotãoTabela, estilizarCard,
    estilizarColumnHeader, estilizarColunaConsultar, estilizarDataTable, estilizarDataTablePaginator,
    estilizarDivider, estilizarFilterMenu, estilizarFlex, estilizarTriStateCheckbox
}
    from "../../utilitários/estilos";

// COMPONENTE RENOMEADO
export default function PesquisarVagasEmprego() {
    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);

    // CONTEXTO MODIFICADO
    const { vagaEmpregoConsultada, setVagaEmpregoConsultada, setVagaEmpregoSelecionada } // <-- MODIFICADO
        = useContext(ContextoDiarista); // <-- MODIFICADO

    // ESTADO MODIFICADO
    const [listaVagasEmprego, setListaVagasEmprego] = useState([]); // <-- MODIFICADO
    const navegar = useNavigate();

    // REMOVIDO: 'opçõesCategoria' não se aplica.

    function retornarCadastrarInteresse() {
        setVagaEmpregoSelecionada(vagaEmpregoConsultada); // <-- MODIFICADO
        setVagaEmpregoConsultada(null); // <-- MODIFICADO
        navegar("../cadastrar-interesse");
    };

    function ConsultarTemplate(vagaEmprego) { // <-- MODIFICADO
        return (
            <Button icon="pi pi-search"
                className={estilizarBotãoTabela(usuárioLogado.cor_tema,
                    vagaEmpregoConsultada?.id === vagaEmprego.id)} // <-- MODIFICADO
                tooltip="Consultar Vaga de Emprego" tooltipOptions={{ position: 'top' }} // <-- MODIFICADO
                onClick={() => {
                    setVagaEmpregoConsultada(vagaEmprego); // <-- MODIFICADO
                    navegar("../consultar-vagas-emprego");; // <-- MODIFICADO
                }} />
        );
    };

    // REMOVIDO: 'DropdownÁreaTemplate' não se aplica.

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
        async function buscarVagasEmprego() { // <-- MODIFICADO
            try {
                // SERVIÇO MODIFICADO
                const response = await serviçoBuscarVagasEmprego(); // <-- MODIFICADO
                if (!desmontado && response.data) setListaVagasEmprego(response.data); // <-- MODIFICADO
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
        };
        buscarVagasEmprego(); 
        return () => desmontado = true;
    }, []); 

    return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} position="bottom-center" />
            {/* TÍTULO MODIFICADO */}
            <Card title="Pesquisar Vagas de Emprego" className={estilizarCard(usuárioLogado.cor_tema)}>
                <DataTable dataKey="id" size="small" paginator rows={TAMANHOS.MAX_LINHAS_TABELA}
                    emptyMessage="Nenhuma vaga de emprego encontrada." value={listaVagasEmprego} // <-- MODIFICADO
                    responsiveLayout="scroll" breakpoint="490px" removableSort
                    className={estilizarDataTable()}
                    paginatorClassName={estilizarDataTablePaginator(usuárioLogado.cor_tema)}>

                    {/* Coluna de Consulta (Mantida) */}
                    <Column bodyClassName={estilizarColunaConsultar()} body={ConsultarTemplate}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} />

                    {/* MODIFICADO: de 'professor' para 'gerente_empresa' */}
                    <Column field="gerente_empresa.usuário.nome" header="Nome do Gerente" filter
                        showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />

                    {/* MODIFICADO: de 'título' para 'descrição' */}
                    <Column field="descrição" header="Descrição" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />

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

                    {/* REMOVIDO: Coluna 'Categoria' */}
                    {/* REMOVIDO: Coluna 'Área de Atuação' */}

                    {/* MODIFICADO: de 'concorrendo_bolsa' para 'urgência' */}
                    <Column field="urgência" header="Urgência" dataType="boolean" filter
                        showFilterOperator={false}
                        body={BooleanBodyTemplate} filterElement={BooleanFilterTemplate}
                        filterMatchMode="equals" showClearButton={false} showAddButton={false}
                        filterMenuClassName={estilizarFilterMenu()}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />
                </DataTable>
                <Divider className={estilizarDivider()} />
                <Button className={estilizarBotãoRetornar()} label="Retornar"
                    onClick={retornarCadastrarInteresse} />
            </Card>
        </div>
    );
}