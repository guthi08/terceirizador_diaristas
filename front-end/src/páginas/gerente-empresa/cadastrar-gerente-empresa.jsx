import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";


/*Add serviçoAtualizarProfessor, no meu caso serviçoAtualizarGerenteEmpresa*/

import ContextoUsuário from "../../contextos/contexto-usuário";
import { serviçoCadastrarGerenteEmpresa, serviçoBuscarGerenteEmpresa, serviçoAtualizarGerenteEmpresa }
  from "../../serviços/serviços-gerente-empresa";
import mostrarToast from "../../utilitários/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios }
  from "../../utilitários/validações";
import {
  estilizarBotão, estilizarBotãoRetornar, estilizarCard, estilizarDivCampo, estilizarDivider,
  estilizarDropdown, estilizarFlex, estilizarInlineFlex, estilizarInputNumber, estilizarLabel
}
  from "../../utilitários/estilos";



export default function CadastrarGerenteEmpresa() {
  const referênciaToast = useRef(null);
  const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
  const [dados, setDados] = useState({ titulação: "", anos_experiência_empresarial: "" });
  const [erros, setErros] = useState({});
  const [cpfExistente, setCpfExistente] = useState(false);
  const navegar = useNavigate();
  
  const opçõesTitulação = [{ label: "Gerente administrativo", value: "gerente administrativo" },
  { label: "Gerente financeiro", value: "gerente financeiro" }];
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
    if (usuárioLogado?.cadastrado) return "Consultar Gerente empresa";
    else return "Alterar Gerente Empresa"; //ver se o "empresa é com E ou e"
  };



  async function cadastrarGerenteEmpresa() {
    if (validarCampos()) {
      try {
        const response = await serviçoCadastrarGerenteEmpresa({
          ...dados, usuário_info: usuárioLogado,
          titulação: dados.titulação,
          anos_experiência_empresarial: dados.anos_experiência_empresarial
        });
        if (response.data)
          setUsuárioLogado(usuário => ({
            ...usuário, status: response.data.status,
            token: response.data.token
          }));
        mostrarToast(referênciaToast, "Gerente cadastrado com sucesso!", "sucesso");
      } catch (error) {
        setCpfExistente(true);
        mostrarToast(referênciaToast, error.response.data.erro, "erro");
      }
    }
  };



  function labelBotãoSalvar() {
    if (usuárioLogado?.cadastrado) return "Alterar"; //mudar de "Salvar" para "Alterar"
    else return "Cadastrar";
  };


  //função substituida na etapa 2
  function açãoBotãoSalvar() {
    if (usuárioLogado?.cadastrado) atualizarGerenteEmpresa();
    else cadastrarGerenteEmpresa();
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



  //função add na etapa 2
  async function atualizarGerenteEmpresa() {
    if (validarCampos()) {
      try {
        const response = await serviçoAtualizarGerenteEmpresa({ ...dados, cpf: usuárioLogado.cpf });
        if (response) mostrarToast(referênciaToast, "Gerente atualizado com sucesso!", "sucesso");
      } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
    }
  };



  useEffect(() => {
    let desmontado = false;
    async function buscarDadosGerenteEmpresa() {
      try {
        const response = await serviçoBuscarGerenteEmpresa(usuárioLogado.cpf);
        if (!desmontado && response.data) {
          setDados(dados => ({
            ...dados, titulação: response.data.titulação,
            anos_experiência_empresarial: response.data.anos_experiência_empresarial
          }));
        }
      } catch (error) {
        const erro = error.response.data.erro;
        if (erro) mostrarToast(referênciaToast, erro, "erro");
      }
    }
    if (usuárioLogado?.cadastrado) buscarDadosGerenteEmpresa();
    return () => desmontado = true;
  }, [usuárioLogado?.cadastrado, usuárioLogado.cpf]);
  return (
    <div className={estilizarFlex()}>
      <Toast ref={referênciaToast} onHide={redirecionar} position="bottom-center" />
      <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Titulação*:</label>
          <Dropdown name="titulação"
            className={estilizarDropdown(erros.titulação, usuárioLogado.cor_tema)}
            value={dados.titulação} options={opçõesTitulação} onChange={alterarEstado}
            placeholder="-- Selecione --" />
          <MostrarMensagemErro mensagem={erros.titulação} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Anos de Experiência Empresarial*:</label>
          <InputNumber name="anos_experiência_empresarial" size={5}
            value={dados.anos_experiência_empresarial}
            onValueChange={alterarEstado} mode="decimal"
            inputClassName={estilizarInputNumber(erros.anos_experiência_empresarial,
              usuárioLogado.cor_tema)} />
          <MostrarMensagemErro mensagem={erros.anos_experiência_empresarial} />
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