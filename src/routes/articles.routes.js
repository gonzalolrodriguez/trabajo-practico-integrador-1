import { Router } from "express";
import { body, param } from "express-validator";
import {
    createArticle,
    getArticles,
    getArticleById,
    getUserArticles,
    getUserArticleById,
    updateArticle,
    deleteArticle
} from "../controllers/articles.controllers.js";
import { validate, validateId, validateResourceExists } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware } from "../middlewares/admin.js";
import { ownerMiddleware } from "../middlewares/owner.js";
import { Article } from "../models/articles.models.js";

const router = Router();

router.post(
    "/articles",
    authMiddleware,
    [
        body("title")
            .notEmpty().withMessage("Título es requerido")
            .isLength({ min: 3, max: 200 }).withMessage("Título debe tener entre 3 y 200 caracteres"),
        body("content")
            .notEmpty().withMessage("Contenido es requerido")
            .isLength({ min: 50 }).withMessage("Contenido debe tener al menos 50 caracteres"),
        body("excerpt")
            .optional()
            .isLength({ max: 500 }).withMessage("Resumen no puede exceder los 500 caracteres"),
        body("status")
            .optional()
            .isIn(['published', 'archived']).withMessage("Estado debe ser 'published' o 'archived'"),
        body("tag_ids")
            .optional()
            .isArray().withMessage("tag_ids debe ser un array")
    ],
    validate,
    createArticle
);

router.get("/articles", authMiddleware, getArticles);

router.get(
    "/articles/:id",
    [
        param("id").isInt().withMessage("ID debe ser un número entero")
    ],
    validate,
    validateId,
    validateResourceExists(Article),
    authMiddleware,
    getArticleById
);

router.get("/articles/user/me", authMiddleware, getUserArticles);

router.get(
    "/articles/user/:id",
    [
        param("id").isInt().withMessage("ID debe ser un número entero")
    ],
    validate,
    validateId,
    validateResourceExists(Article),
    authMiddleware,
    getUserArticleById
);

router.put(
    "/articles/:id",
    [
        param("id").isInt().withMessage("ID debe ser un número entero"),
        body("title")
            .optional()
            .isLength({ min: 3, max: 200 }).withMessage("Título debe tener entre 3 y 200 caracteres"),
        body("content")
            .optional()
            .isLength({ min: 50 }).withMessage("Contenido debe tener al menos 50 caracteres"),
        body("excerpt")
            .optional()
            .isLength({ max: 500 }).withMessage("Resumen no puede exceder los 500 caracteres"),
        body("status")
            .optional()
            .isIn(['published', 'archived']).withMessage("Estado debe ser 'published' o 'archived'"),
        body("tag_ids")
            .optional()
            .isArray().withMessage("tag_ids debe ser un array")
    ],
    validate,
    validateId,
    authMiddleware,
    ownerMiddleware(Article),
    updateArticle
);

router.delete(
    "/articles/:id",
    [
        param("id").isInt().withMessage("ID debe ser un número entero")
    ],
    validate,
    validateId,
    authMiddleware,
    ownerMiddleware(Article),
    deleteArticle
);

export default router;