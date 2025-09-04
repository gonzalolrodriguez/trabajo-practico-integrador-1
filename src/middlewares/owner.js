export const ownerMiddleware = (model, idParam = 'id') => {
    return async (req, res, next) => {
        try {
            const resourceId = req.params[idParam];
            const resource = await model.findByPk(resourceId);

            if (!resource) {
                return res.status(404).json({
                    message: "Recurso no encontrado",
                    error: `El ${model.name} no existe`
                });
            }

            if (req.user.role !== 'admin' && resource.user_id !== req.user.id) {
                return res.status(403).json({
                    message: "Acceso denegado",
                    error: "Solo puedes acceder a tus propios recursos"
                });
            }

            req.resource = resource;
            next();
        } catch (error) {
            return res.status(500).json({
                message: "Error al verificar propiedad",
                error: error.message
            });
        }
    };
};