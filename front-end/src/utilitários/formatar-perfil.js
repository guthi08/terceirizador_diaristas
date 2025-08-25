export default function formatarPerfil(perfil) {
    switch(perfil) {
        case "gerente-empresa": return "Gerente";
        case "diarista": return "diarista";
    default: return;
    }
};