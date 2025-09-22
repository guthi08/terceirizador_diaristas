import { Perfil } from '../entidades/usuário';
export default function verificarPerfilDiarista(request, response, next) {
    if (request.perfil === Perfil.DIARISTA) return next();
    else return response.status(401).json({ erro: "Acesso não autorizado." });
};