import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

import ContextoUsuário from "../../contextos/contexto-usuário";
import { TEMPO_MÁSCARA } from "../../utilitários/máscaras";
import { serviçoCadastrarDiarista, serviçoAtualizarDiarista, serviçoBuscarDiarista } //mudei serviçoBuscarAluno para serviçoBuscarDiarista
    from "../../serviços/serviços-diarista"; //mudei de serviços-aluno para serviços-diarista
import mostrarToast from "../../utilitários/mostrar-toast";

import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios }
    from "../../utilitários/validações";
import {
    TAMANHOS, estilizarBotão, estilizarBotãoRetornar, estilizarCard, estilizarDivCampo,
    estilizarDivider, estilizarDropdown, estilizarFlex, estilizarInlineFlex, estilizarInputMask,
    estilizarInputText, estilizarLabel
} from "../../utilitários/estilos";



export default function CadastrarDiarista() {
    const referênciaToast = useRef(null);
    const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
    const [dados, setDados] = useState({
        área_atuação: "", tempo_experiência_área: "", data_nascimento: ""
    });



    const [erros, setErros] = useState({});
    const [cpfExistente, setCpfExistente] = useState(false);
    const navegar = useNavigate();
    //técnico, garçom, caixa, serviços_gerais
    //mudei opçõesCurso para áreaAtuação
    const área_Atuação = [
    { label: "Técnico", value: "técnico" },
    { label: "Garçom", value: "garçom" },
    { label: "Caixa", value: "caixa" },
    { label: "Serviços Gerais", value: "serviços gerais" }
    ];

    function alterarEstado(event) {
        const chave = event.target.name || event.value;
        const valor = event.target.value;
        setDados({ ...dados, [chave]: valor });
    };


    function validarCampos() {
        let errosCamposObrigatórios;
        errosCamposObrigatórios = validarCamposObrigatórios(dados);
        setErros(errosCamposObrigatórios);
        return checarListaVazia(errosCamposObrigatórios);
    };


    function títuloFormulário() {
        if (usuárioLogado?.cadastrado) return "Alterar Diarista"; //mudei de Aluno para Diarista
        else return "Cadastrar Diarista"; //mudei de Aluno para Diarista
    };


    async function cadastrarDiarista() {
        if (validarCampos()) {
            try {
                const response = await serviçoCadastrarDiarista({
                    ...dados, usuário_info: usuárioLogado,
                    área_atuação: dados.área_atuação, tempo_experiência_área: dados.tempo_experiência_área,
                    data_nascimento: dados.data_nascimento
                });
                if (response.data)
                    setUsuárioLogado(usuário => ({
                        ...usuário, status: response.data.status,
                        token: response.data.token
                    }));
                mostrarToast(referênciaToast, "Diarista cadastrado com sucesso!", "sucesso");
            } catch (error) {
                setCpfExistente(true);
                mostrarToast(referênciaToast, error.response.data.erro, "erro");
            }
        }
    };



    async function atualizarDiarista() {
        if (validarCampos()) {
            try {
                const response = await serviçoAtualizarDiarista({ ...dados, cpf: usuárioLogado.cpf });
                if (response) mostrarToast(referênciaToast, "Diarista atualizado com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
        }
    };



    function labelBotãoSalvar() {
        if (usuárioLogado?.cadastrado) return "Alterar";
        else return "Cadastrar";
    };



    function açãoBotãoSalvar() {
        if (usuárioLogado?.cadastrado) atualizarDiarista();
        else cadastrarDiarista();
    };



    function redirecionar() {
        if (cpfExistente) {
            setUsuárioLogado(null);
            navegar("/criar-usuario");
        } else {
            setUsuárioLogado(usuárioLogado => ({ ...usuárioLogado, cadastrado: true }));
            navegar("/pagina-inicial");
        }
    };



    useEffect(() => {
        let desmontado = false;
        async function buscarDadosDiarista() {
            try {
                const response = await serviçoBuscarDiarista(usuárioLogado.cpf);
                if (!desmontado && response.data) {
                    setDados(dados => ({
                        ...dados, área_atuação: response.data.área_atuação,
                        tempo_experiência_área: response.data.tempo_experiência_área,

                        data_nascimento: response.data.data_nascimento
                    }));
                }
            } catch (error) {
                const erro = error.response.data.erro;
                if (erro) mostrarToast(referênciaToast, erro, "erro");
            }
        }
        if (usuárioLogado?.cadastrado) buscarDadosDiarista();
        return () => desmontado = true;
    }, [usuárioLogado?.cadastrado, usuárioLogado.cpf]);
    return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} onHide={redirecionar} position="bottom-center" />
            <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Área de Atuação*:</label>
                    <Dropdown name="área_atuação" className={estilizarDropdown(erros.área_atuação, usuárioLogado.cor_tema)}
                        value={dados.área_atuação} options={área_Atuação} onChange={alterarEstado}

                        placeholder="-- Selecione --" />
                    <MostrarMensagemErro mensagem={erros.área_atuação} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Tempo de Experiência na área*:</label>
                    <InputMask name="tempo_experiência_área" autoClear size={TAMANHOS.ANO} onChange={alterarEstado}
                        className={estilizarInputMask(erros.tempo_experiência_área, usuárioLogado.cor_tema)}
                        mask={TEMPO_MÁSCARA} value={dados.tempo_experiência_área} />
                    <MostrarMensagemErro mensagem={erros.tempo_experiência_área} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Data de Nascimento*:</label>
                    <InputText name="data_nascimento" type="date" value={dados.data_nascimento}
                        className={estilizarInputText(erros.data_nascimento, usuárioLogado.cor_tema)}
                        onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.data_nascimento} />
                </div>
            
                <Divider className={estilizarDivider(dados.cor_tema)} />
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={redirecionar} />
                    <Button className={estilizarBotão()} label={labelBotãoSalvar()} onClick={açãoBotãoSalvar} />
                </div>
            </Card>
        </div>
    );
};