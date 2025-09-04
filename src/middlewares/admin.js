export const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            message: "Acceso denegado",
            error: "Se requieren permisos de administrador"
        });
    }
    next();
};