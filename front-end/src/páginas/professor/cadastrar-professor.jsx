import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import { serviçoCadastrarProfessor, serviçoBuscarProfessor }
 from "../../serviços/serviços-professor";
import mostrarToast from "../../utilitários/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios }
 from "../../utilitários/validações";
 import {estilizarBotão, estilizarBotãoRetornar, estilizarCard, estilizarDivCampo, estilizarDivider,
 estilizarDropdown, estilizarFlex, estilizarInlineFlex, estilizarInputNumber, estilizarLabel }
 from "../../utilitários/estilos";
export default function CadastrarProfessor() {
const referênciaToast = useRef(null);
const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
const [dados, setDados] = useState({ titulação: "", anos_experiência_empresarial: "" });
const [erros, setErros] = useState({});
const [cpfExistente, setCpfExistente] = useState(false);
const navegar = useNavigate();
const opçõesTitulação = [{ label: "Mestrado", value: "mestrado" },
 { label: "Doutorado", value: "doutorado" }];
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
if (usuárioLogado?.cadastrado) return "Consultar Professor";
else return "Cadastrar Professor";
 };
async function cadastrarProfessor() {
if (validarCampos()) {
try {
const response = await serviçoCadastrarProfessor({ ...dados, usuário_info: usuárioLogado,
 titulação: dados.titulação,
 anos_experiência_empresarial: dados.anos_experiência_empresarial });
if (response.data)
 setUsuárioLogado(usuário => ({ ...usuário, status: response.data.status,
 token: response.data.token }));
 mostrarToast(referênciaToast, "Professor cadastrado com sucesso!", "sucesso");
 } catch (error) {
 setCpfExistente(true);
 mostrarToast(referênciaToast, error.response.data.erro, "erro");
 }
 }
 };
function labelBotãoSalvar() {
if (usuárioLogado?.cadastrado) return "Consultar";
else return "Cadastrar";
 };
function açãoBotãoSalvar() {
if (!usuárioLogado?.cadastrado) cadastrarProfessor();
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
async function buscarDadosProfessor() {
try {
const response = await serviçoBuscarProfessor(usuárioLogado.cpf);
if (!desmontado && response.data) {
 setDados(dados => ({ ...dados, titulação: response.data.titulação,
 anos_experiência_empresarial: response.data.anos_experiência_empresarial }));
 }
 } catch (error) {
const erro = error.response.data.erro;
if (erro) mostrarToast(referênciaToast, erro, "erro");
 }
 }
if (usuárioLogado?.cadastrado) buscarDadosProfessor();
return () => desmontado = true;
 }, [usuárioLogado?.cadastrado, usuárioLogado.cpf]);
return (
<div className={estilizarFlex()}>
<Toast ref={referênciaToast} onHide={redirecionar} position="bottom-center"/>
<Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>
<div className={estilizarDivCampo()}>
<label className={estilizarLabel(usuárioLogado.cor_tema)}>Titulação*:</label>
<Dropdown name="titulação"
 className={estilizarDropdown(erros.titulação, usuárioLogado.cor_tema)}
value={dados.titulação} options={opçõesTitulação} onChange={alterarEstado}
 placeholder="-- Selecione --"/>
<MostrarMensagemErro mensagem={erros.titulação}/>
</div>
<div className={estilizarDivCampo()}>
<label className={estilizarLabel(usuárioLogado.cor_tema)}>
 Anos de Experiência Empresarial*:</label>
<InputNumber name="anos_experiência_empresarial" size={5}
 value={dados.anos_experiência_empresarial}
onValueChange={alterarEstado} mode="decimal"
inputClassName={estilizarInputNumber(erros.anos_experiência_empresarial,
 usuárioLogado.cor_tema)}/>
<MostrarMensagemErro mensagem={erros.anos_experiência_empresarial}/>
</div>
<Divider className={estilizarDivider(dados.cor_tema)}/>
<div className={estilizarInlineFlex()}>
<Button className={estilizarBotãoRetornar()} label="Retornar" onClick={redirecionar} />
<Button className={estilizarBotão()} label={labelBotãoSalvar()} onClick={açãoBotãoSalvar}/>
</div>
</Card>
</div>
 );
};
