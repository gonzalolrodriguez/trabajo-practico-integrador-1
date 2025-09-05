import { validationResult } from "express-validator";




export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Errores de validación",
            errors: errors.array().map(error => ({
                field: error.path,
                value: error.value,
                message: error.msg,
                location: error.location
            }))
        });
    }

    next();
};

// Middleware para validar IDs en parámetros

export const validateId = (req, res, next) => {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
        return res.status(400).json({
            message: "ID inválido",
            error: "El ID debe ser un número entero positivo"
        });
    }

    req.params.id = parseInt(id);
    next();
};

// Middleware para validar que un recurso existe

export const validateResourceExists = (model) => {
    return async (req, res, next) => {
        try {
            const resource = await model.findByPk(req.params.id);

            if (!resource) {
                return res.status(404).json({
                    message: "Recurso no encontrado",
                    error: `El ${model.name} no existe`
                });
            }

            req.resource = resource;
            next();
        } catch (error) {
            return res.status(500).json({
                message: "Error al validar recurso",
                error: error.message
            });
        }
    };
};

// Middleware para validar unicidad de campos

export const validateUniqueField = (model, field, message) => {
    return async (req, res, next) => {
        try {
            const value = req.body[field];

            if (!value) {
                return next();
            }

            const whereClause = { [field]: value };
            if (req.params.id) {
                whereClause.id = { [Op.ne]: req.params.id };
            }

            const existing = await model.findOne({ where: whereClause });

            if (existing) {
                return res.status(400).json({
                    message: "Campo duplicado",
                    error: message || `El ${field} ya está en uso`
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Error al validar campo único",
                error: error.message
            });
        }
    };
};