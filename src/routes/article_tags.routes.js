import { Router } from "express";
import { body, param } from "express-validator";
import { addTagToArticle, removeTagFromArticle } from "../controllers/article_tags.controllers.js";
import { validate, validateId } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.post(
    "/articles-tags",
    authMiddleware,
    [
        body("article_id")
            .notEmpty().withMessage("article_id es requerido")
            .isInt().withMessage("article_id debe ser un número entero"),
        body("tag_id")
            .notEmpty().withMessage("tag_id es requerido")
            .isInt().withMessage("tag_id debe ser un número entero")
    ],
    validate,
    addTagToArticle
);

router.delete(
    "/articles-tags/:articleTagId",
    [
        param("articleTagId").isInt().withMessage("articleTagId debe ser un número entero")
    ],
    validate,
    validateId,
    authMiddleware,
    removeTagFromArticle
);

export default router;