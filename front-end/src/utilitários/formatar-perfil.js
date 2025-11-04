
export default function formatarPerfil(perfil) {
  switch(perfil) {
    case "gerente empresa": return "Gerente empresa"; //seguindo a regra letar maiúscula primerio
    case "diarista": return "Diarista";
    default: return;
  }
};