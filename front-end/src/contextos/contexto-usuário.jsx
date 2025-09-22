import { createContext, useState } from "react";
const ContextoUsuário = createContext();
export default ContextoUsuário;
export function ProvedorUsuário({ children }) {

  //constantes add na etapa 2
  const [cpfVerificado, setCpfVerificado] = useState(null);
  const [novaSenha, setNovaSenha] = useState({});
  const [tokenRecuperação, setTokenRecuperação] = useState(null);

  const [usuárioLogado, setUsuárioLogado] = useState(null);
  const [confirmaçãoUsuário, setConfirmaçãoUsuário] = useState(null);
  const [mostrarModalConfirmação, setMostrarModalConfirmação] = useState(false);


  return (
    
    /*add na etapa 2:
    cpfVerificado, setCpfVerificado, novaSenha, setNovaSenha, tokenRecuperação, setTokenRecuperação */

    
    <ContextoUsuário.Provider value={{ usuárioLogado, setUsuárioLogado,
    confirmaçãoUsuário, setConfirmaçãoUsuário, mostrarModalConfirmação, setMostrarModalConfirmação,
    cpfVerificado, setCpfVerificado, novaSenha, setNovaSenha, tokenRecuperação, setTokenRecuperação
    }}>{children}</ContextoUsuário.Provider>
  );
}