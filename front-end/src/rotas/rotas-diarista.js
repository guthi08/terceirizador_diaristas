import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UsuárioContext from "../contextos/contexto-usuário";

// COMPONENTE RENOMEADO
export default function RotasDiarista() { // <-- Alterado de RotasAluno
    const { usuárioLogado } = useContext(UsuárioContext);

    // (A sua lógica já estava correta, verificando "diarista")
    if (usuárioLogado.perfil === "diarista") {
        return <Outlet/>;
    }
    else {
        return <Navigate to="/"/>;
    }
}