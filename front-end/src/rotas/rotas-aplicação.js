import { Route, BrowserRouter, Routes } from "react-router-dom";
import RotasUsuárioLogado from "./rotas-usuário-logado";
import LogarUsuário from "../páginas/usuário/logar-usuário";
import CadastrarUsuário from "../páginas/usuário/cadastrar-usuário";
import PáginaInicial from "../páginas/usuário/página-inicial";
import CadastrarGerenteEmpresa from "../páginas/gerente-empresa/cadastrar-gerente-empresa";

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
    </Route>
    </Routes>
    </BrowserRouter>
    );
};