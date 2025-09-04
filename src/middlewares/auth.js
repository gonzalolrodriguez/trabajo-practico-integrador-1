import { verifyToken } from '../helpers/jwt.js';
import { User } from '../models/users.models.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Acceso no autorizado",
                error: "Token no proporcionado"
            });
        }

        const decoded = verifyToken(token);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "Token inválido",
                error: "Usuario no encontrado"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token inválido",
            error: error.message
        });
    }
};