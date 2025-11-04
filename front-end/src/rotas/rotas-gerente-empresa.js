import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UsuárioContext from "../contextos/contexto-usuário"; // <-- Contexto correto, mantido

// COMPONENTE RENOMEADO
export default function RotasGerenteEmpresa() {
    const { usuárioLogado } = useContext(UsuárioContext);

    // CONDIÇÃO MODIFICADA
    // (Verificando o valor exato da sua Enum 'Perfil' em Usuário.ts)
    if (usuárioLogado.perfil === "gerente empresa") {
        return <Outlet/>;
    }
    else {
        return <Navigate to="/"/>;
    }
}