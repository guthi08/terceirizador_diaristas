import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { TriStateCheckbox } from "primereact/tristatecheckbox";

// CONTEXTO MODIFICADO
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoDiarista from "../../contextos/contexto-diarista"; // <-- MODIFICADO

import mostrarToast from "../../utilitários/mostrar-toast";

// SERVIÇO MODIFICADO
import { serviçoBuscarInteressesDiarista } from "../../serviços/serviços-diarista"; // <-- MODIFICADO

import {
    TAMANHOS, estilizarBotão, estilizarBotãoRetornar, estilizarBotãoTabela, estilizarCard,
    estilizarColumnHeader, estilizarColunaConsultar, estilizarDataTable, estilizarDataTablePaginator,
    estilizarDivider, estilizarFilterMenu, estilizarFlex, estilizarTriStateCheckbox
}
    from "../../utilitários/estilos";

export default function AdministrarInteresses() {
    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);

    
    const { interesseConsultado, setInteresseConsultado, setVagaEmpregoSelecionada } // <-- MODIFICADO
        = useContext(ContextoDiarista); // <-- MODIFICADO

    const [listaInteresses, setListaInteresses] = useState([]);
    const navegar = useNavigate();

   

    function retornarPáginaInicial() { navegar("/pagina-inicial"); };

    function adicionarInteresse() {
        setInteresseConsultado(null);
        setVagaEmpregoSelecionada(null); // <-- MODIFICADO
        navegar("../cadastrar-interesse");
    };

    function ConsultarTemplate(interesse) {
        function consultar() {
            setInteresseConsultado(interesse);
            setVagaEmpregoSelecionada(null); // <-- MODIFICADO
            navegar("../cadastrar-interesse");
        };
        return (
            <Button icon="pi pi-search"
                className={estilizarBotãoTabela(usuárioLogado.cor_tema,
                    interesseConsultado?.id === interesse.id)}
                tooltip="Consultar interesse" tooltipOptions={{ position: 'top' }} onClick={consultar} />
        );
    };

    

   
    function CurrencyBodyTemplate(valor) {
        if (valor === null || valor === undefined) return null;
        return valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    };

    
    function BooleanBodyTemplate(interesse) {
        if (interesse.prontidão) return "Sim"; // <-- MODIFICADO
        else return "Não";
    };

    // MODIFICADO: Adaptado de 'necessidade_bolsa' para 'prontidão'
    function BooleanFilterTemplate(opções) {
        function alterarFiltroTriState(event) { return opções.filterCallback(event.value); };
        return (
            <div>
                <label>Prontidão:</label> {/* <-- MODIFICADO */}
                <TriStateCheckbox
                    className={estilizarTriStateCheckbox(usuárioLogado?.cor_tema)} value={opções.value}
                    onChange={alterarFiltroTriState} />
            </div>
        );
    };

    useEffect(() => {
        let desmontado = false;
        // FUNÇÃO MODIFICADA
        async function buscarInteressesDiarista() { // <-- MODIFICADO
            try {
                // SERVIÇO MODIFICADO
                const response = await serviçoBuscarInteressesDiarista(usuárioLogado.cpf); // <-- MODIFICADO
                if (!desmontado && response.data) setListaInteresses(response.data);
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
        };
        buscarInteressesDiarista(); // <-- MODIFICADO
        return () => desmontado = true;
    }, [usuárioLogado.cpf]);

    return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} position="bottom-center" />
            <Card title="Administrar Interesses" className={estilizarCard(usuárioLogado.cor_tema)}>
                <DataTable dataKey="id" size="small" paginator rows={TAMANHOS.MAX_LINHAS_TABELA}
                    emptyMessage="Nenhum interesse encontrado." value={listaInteresses}
                    responsiveLayout="scroll" breakpoint="490px" removableSort
                    className={estilizarDataTable()}
                    paginatorClassName={estilizarDataTablePaginator(usuárioLogado.cor_tema)}>

                    {/* Coluna de Consulta (Mantida) */}
                    <Column bodyClassName={estilizarColunaConsultar()} body={ConsultarTemplate}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} />

                    {/* MODIFICADO: de 'proposta.professor...' para 'vaga_emprego.gerente_empresa...' */}
                    <Column field="vaga_emprego.gerente_empresa.usuário.nome" header="Gerente" filter
                        showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />

                    {/* MODIFICADO: de 'proposta.título' para 'vaga_emprego.descrição' */}
                    <Column field="vaga_emprego.descrição" header="Descrição da Vaga" filter
                        showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />

                    {/* ADICIONADO: Coluna para Salário da Vaga */}
                    <Column field="vaga_emprego.salário" header="Salário da Vaga"
                        body={(interesse) => CurrencyBodyTemplate(interesse.vaga_emprego.salário)}
                        dataType="numeric"
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />

                    {/* ADICIONADO: Coluna para Diária Ofertada */}
                    <Column field="valor_diária" header="Diária Ofertada"
                        body={(interesse) => CurrencyBodyTemplate(interesse.valor_diária)}
                        dataType="numeric"
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />

                    {/* MODIFICADO: de 'necessidade_bolsa' para 'prontidão' */}
                    <Column field="prontidão" header="Prontidão" dataType="boolean" filter
                        showFilterOperator={false} body={BooleanBodyTemplate}
                        filterElement={BooleanFilterTemplate} filterMatchMode="equals" showClearButton={false}
                        showAddButton={false} filterMenuClassName={estilizarFilterMenu()}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />

                </DataTable>
                <Divider className={estilizarDivider()} />
                <Button className={estilizarBotãoRetornar()} label="Retornar"
                    onClick={retornarPáginaInicial} />
                <Button className={estilizarBotão()} label="Adicionar" onClick={adicionarInteresse} />
            </Card>
        </div>
    );
}