import { Route, BrowserRouter, Routes } from "react-router-dom";
import RotasUsuárioLogado from "./rotas-usuário-logado";
import LogarUsuário from "../páginas/usuário/logar-usuário";
import CadastrarUsuário from "../páginas/usuário/cadastrar-usuário";
import PáginaInicial from "../páginas/usuário/página-inicial";
import RecuperarAcesso from "../páginas/usuário/recuperar-acesso";

// Imports do Gerente Empresa (Corretos)
import CadastrarGerenteEmpresa from "../páginas/gerente-empresa/cadastrar-gerente-empresa";
import AdministrarVagasEmprego from "../páginas/gerente-empresa/administrar-vagas-emprego"; // <-- MODIFICADO
import CadastrarVagaEmprego from "../páginas/gerente-empresa/cadastrar-vagas-emprego"; // <-- MODIFICADO

// Imports da Diarista (Corretos)
import CadastrarDiarista from "../páginas/diarista/cadastrar-diarista";
import AdministrarInteresses from "../páginas/diarista/administrar-interesses"; // <-- (Nome mantido)
import CadastrarInteresse from "../páginas/diarista/cadastrar-interesse"; // <-- (Nome mantido)
import PesquisarVagasEmprego from "../páginas/diarista/pesquisar-vagas-emprego"; // <-- MODIFICADO
import ConsultarVagaEmprego from "../páginas/diarista/consultar-vagas-emprego"; // <-- MODIFICADO

// Contextos e Rotas Protegidas (MODIFICADOS)
import { ProvedorGerenteEmpresa } from "../contextos/contexto-gerente-empresa"; // <-- MODIFICADO
import { ProvedorDiarista } from "../contextos/contexto-diarista"; // <-- MODIFICADO
import RotasGerenteEmpresa from "./rotas-gerente-empresa"; // <-- MODIFICADO
import RotasDiarista from "./rotas-diarista"; // <-- MODIFICADO


export default function RotasAplicação() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route element={<LogarUsuário />} path="/" />
        <Route element={<CadastrarUsuário />} path="criar-usuario" />
        <Route element={<RecuperarAcesso />} path="recuperar-acesso" />

        {/* Rotas Protegidas (Usuário Logado) */}
        <Route element={<RotasUsuárioLogado />}>
          <Route element={<PáginaInicial />} path="pagina-inicial" />
          <Route element={<CadastrarUsuário />} path="atualizar-usuario" />

          {/* --- Bloco do Gerente Empresa --- */}
          <Route element={<ProvedorGerenteEmpresa><RotasGerenteEmpresa /></ProvedorGerenteEmpresa>}>

            {/* Corrigido: Usando o componente que você importou */}
            <Route element={<CadastrarGerenteEmpresa />} path="cadastrar-gerente-empresa" />

            <Route element={<AdministrarVagasEmprego />} path="administrar-vagas-emprego" />
            <Route element={<CadastrarVagaEmprego />} path="cadastrar-vaga-emprego" />
          </Route>

          {/* --- Bloco da Diarista --- */}
          <Route element={<ProvedorDiarista><RotasDiarista /></ProvedorDiarista>}>

            {/* Corrigido: Usando o componente que você importou */}
            <Route element={<CadastrarDiarista />} path="cadastrar-diarista" />

            <Route element={<AdministrarInteresses />} path="administrar-interesses" />
            <Route element={<CadastrarInteresse />} path="cadastrar-interesse" />
            <Route element={<PesquisarVagasEmprego />} path="pesquisar-vagas-emprego" />
            <Route element={<ConsultarVagaEmprego />} path="consultar-vagas-emprego" />
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
};