import { Route, BrowserRouter, Routes } from "react-router-dom";
import RotasUsuárioLogado from "./rotas-usuário-logado";
import LogarUsuário from "../páginas/usuário/logar-usuário";
import CadastrarUsuário from "../páginas/usuário/cadastrar-usuário";
import PáginaInicial from "../páginas/usuário/página-inicial";
import CadastrarGerenteEmpresa from "../páginas/gerente-empresa/cadastrar-gerente-empresa";
//etapa 2 
import RecuperarAcesso from "../páginas/usuário/recuperar-acesso";
import CadastrarDiarista from "../páginas/diarista/cadastrar-diarista";


/*add na etapa 2
<Route element={<CadastrarAluno/>} path="cadastrar-aluno"/> 
<Route element={<RecuperarAcesso/>} path="recuperar-acesso"/>  --> rever esse aqui depois*/

export default function RotasAplicação() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LogarUsuário/>} path="/"/>
        <Route element={<CadastrarUsuário/>} path="criar-usuario"/>
        <Route element={<RotasUsuárioLogado/>}>
        <Route element={<PáginaInicial/>} path="pagina-inicial"/>
        <Route element={<CadastrarUsuário/>} path="atualizar-usuario"/>
        <Route element={<CadastrarGerenteEmpresa/>} path="cadastrar-gerente-empresa"/> 
        
        <Route element={<CadastrarDiarista/>} path="cadastrar-diarista"/> 
        <Route element={<RecuperarAcesso/>} path="recuperar-acesso"/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};