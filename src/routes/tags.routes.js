import { Router } from "express";
import { body, param } from "express-validator";
import { createTag, getTags, getTagById, updateTag, deleteTag } from "../controllers/tags.controllers.js";
import { validate, validateId, validateResourceExists, validateUniqueField } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware } from "../middlewares/admin.js";
import { Tag } from "../models/tags.models.js";

const router = Router();

router.post(
    "/tags",
    [
        body("name")
            .notEmpty().withMessage("Nombre es requerido")
            .isLength({ min: 2, max: 30 }).withMessage("Nombre debe tener entre 2 y 30 caracteres")
            .matches(/^[^\s]+$/).withMessage("Nombre no puede contener espacios")
    ],
    validate,
    authMiddleware,
    adminMiddleware,
    validateUniqueField(Tag, 'name', 'El nombre de etiqueta ya existe'),
    createTag
);

router.get("/tags", authMiddleware, getTags);

router.get(
    "/tags/:id",
    [
        param("id").isInt().withMessage("ID debe ser un número entero")
    ],
    validate,
    validateId,
    validateResourceExists(Tag),
    authMiddleware,
    adminMiddleware,
    getTagById
);

router.put(
    "/tags/:id",
    [
        param("id").isInt().withMessage("ID debe ser un número entero"),
        body("name")
            .optional()
            .isLength({ min: 2, max: 30 }).withMessage("Nombre debe tener entre 2 y 30 caracteres")
            .matches(/^[^\s]+$/).withMessage("Nombre no puede contener espacios")
    ],
    validate,
    validateId,
    validateResourceExists(Tag),
    validateUniqueField(Tag, 'name', 'El nombre de etiqueta ya existe'),
    authMiddleware,
    adminMiddleware,
    updateTag
);

router.delete(
    "/tags/:id",
    [
        param("id").isInt().withMessage("ID debe ser un número entero")
    ],
    validate,
    validateId,
    validateResourceExists(Tag),
    authMiddleware,
    adminMiddleware,
    deleteTag
);

export default router;