import { Perfil } from "../entidades/usuário";

export default function verificarPerfilGerenteEmpresa(request, response, next) {
    if (request.perfil === Perfil.GERENTE_EMPRESA) return next();
    else return response.status(401).json({ erro: "Acesso não autorizado." });
};