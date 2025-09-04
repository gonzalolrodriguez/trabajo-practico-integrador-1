import { ArticleTag } from '../models/article_tags.models.js';
import { Article } from '../models/articles.models.js';
import { Tag } from '../models/tags.models.js';
import { validationResult } from 'express-validator';

export const addTagToArticle = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Errores de validación",
                errors: errors.array()
            });
        }

        const { article_id, tag_id } = req.body;

        const article = await Article.findByPk(article_id);
        if (!article) {
            return res.status(404).json({ message: "Artículo no encontrado" });
        }

        const tag = await Tag.findByPk(tag_id);
        if (!tag) {
            return res.status(404).json({ message: "Etiqueta no encontrada" });
        }

        if (req.user.role !== 'admin' && article.user_id !== req.user.id) {
            return res.status(403).json({
                message: "Acceso denegado",
                error: "Solo puedes agregar etiquetas a tus propios artículos"
            });
        }

        const existingRelation = await ArticleTag.findOne({
            where: { article_id, tag_id }
        });

        if (existingRelation) {
            return res.status(400).json({ message: "La relación ya existe" });
        }

        const relation = await ArticleTag.create({ article_id, tag_id });

        return res.status(201).json({
            message: "Etiqueta agregada al artículo",
            relation
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al agregar etiqueta",
            error: error.message
        });
    }
};

export const removeTagFromArticle = async (req, res) => {
    try {
        const relation = await ArticleTag.findByPk(req.params.articleTagId, {
            include: [{
                model: Article,
                as: 'article'
            }]
        });

        if (!relation) {
            return res.status(404).json({ message: "Relación no encontrada" });
        }

        if (req.user.role !== 'admin' && relation.article.user_id !== req.user.id) {
            return res.status(403).json({
                message: "Acceso denegado",
                error: "Solo puedes remover etiquetas de tus propios artículos"
            });
        }

        await relation.destroy();
        return res.status(200).json({ message: "Etiqueta removida del artículo" });
    } catch (error) {
        return res.status(500).json({
            message: "Error al remover etiqueta",
            error: error.message
        });
    }
};