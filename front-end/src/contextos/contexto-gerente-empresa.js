
import { createContext, useState } from "react";

const ContextoGerenteEmpresa = createContext();
export default ContextoGerenteEmpresa;

export function ProvedorGerenteEmpresa({ children }) {
    // MODIFICADO: Renomeado para refletir a entidade VagaEmprego
    const [vagaEmpregoConsultada, setVagaEmpregoConsultada] = useState({});

    return (
        <ContextoGerenteEmpresa.Provider value={{
            // MODIFICADO: Passando os novos nomes para o contexto
            vagaEmpregoConsultada, setVagaEmpregoConsultada
        }}>
            {children}
        </ContextoGerenteEmpresa.Provider>
    );
}