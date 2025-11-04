import { createContext, useState } from "react";


const ContextoDiarista = createContext();
export default ContextoDiarista;


export function ProvedorDiarista({ children }) {

  
    const [interesseConsultado, setInteresseConsultado] = useState({});
    const [vagaEmpregoConsultada, setVagaEmpregoConsultada] = useState({});
    const [vagaEmpregoSelecionada, setVagaEmpregoSelecionada] = useState({});
    const [vagaEmpregoInteresse, setVagaEmpregoInteresse] = useState({}); // Vaga na qual a diarista quer demonstrar interesse

    return (
        <ContextoDiarista.Provider value={{
            interesseConsultado, setInteresseConsultado,
            vagaEmpregoConsultada, setVagaEmpregoConsultada, // <-- Alterado
            vagaEmpregoSelecionada, setVagaEmpregoSelecionada, // <-- Alterado
            vagaEmpregoInteresse, setVagaEmpregoInteresse // <-- Alterado
        }}>
            {children}
        </ContextoDiarista.Provider>
    );
}