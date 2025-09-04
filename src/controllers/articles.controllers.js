import { Article } from '../models/articles.models.js';
import { Tag } from '../models/tags.models.js';
import { ArticleTag } from '../models/article_tags.models.js';
import { validationResult } from 'express-validator';

export const createArticle = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Errores de validación",
                errors: errors.array()
            });
        }

        const { title, content, excerpt, status, tag_ids } = req.body;

        const article = await Article.create({
            title,
            content,
            excerpt,
            status,
            user_id: req.user.id
        });

        if (tag_ids && tag_ids.length > 0) {
            const tags = await Tag.findAll({ where: { id: tag_ids } });
            await article.addTags(tags);
        }

        const articleWithRelations = await Article.findByPk(article.id, {
            include: [
                { model: Tag, as: 'tags' },
                { association: 'author', attributes: ['id', 'username', 'email'] }
            ]
        });

        return res.status(201).json({
            message: "Artículo creado",
            article: articleWithRelations
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear artículo",
            error: error.message
        });
    }
};

export const getArticles = async (req, res) => {
    try {
        const articles = await Article.findAll({
            where: { status: 'published' },
            include: [
                { model: Tag, as: 'tags' },
                { association: 'author', attributes: ['id', 'username', 'email'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json(articles);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener artículos",
            error: error.message
        });
    }
};

export const getArticleById = async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id, {
            include: [
                { model: Tag, as: 'tags' },
                { association: 'author', attributes: ['id', 'username', 'email'] }
            ]
        });

        if (!article) {
            return res.status(404).json({ message: "Artículo no encontrado" });
        }

        return res.status(200).json(article);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener artículo",
            error: error.message
        });
    }
};

export const getUserArticles = async (req, res) => {
    try {
        const articles = await Article.findAll({
            where: {
                user_id: req.user.id,
                status: 'published'
            },
            include: [
                { model: Tag, as: 'tags' }
            ],
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json(articles);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener artículos del usuario",
            error: error.message
        });
    }
};

export const getUserArticleById = async (req, res) => {
    try {
        const article = await Article.findOne({
            where: {
                id: req.params.id,
                user_id: req.user.id
            },
            include: [
                { model: Tag, as: 'tags' }
            ]
        });

        if (!article) {
            return res.status(404).json({ message: "Artículo no encontrado" });
        }

        return res.status(200).json(article);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener artículo",
            error: error.message
        });
    }
};

export const updateArticle = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Errores de validación",
                errors: errors.array()
            });
        }

        const { title, content, excerpt, status, tag_ids } = req.body;
        const article = req.resource;

        await article.update({ title, content, excerpt, status });

        if (tag_ids) {
            const tags = await Tag.findAll({ where: { id: tag_ids } });
            await article.setTags(tags);
        }

        const updatedArticle = await Article.findByPk(article.id, {
            include: [
                { model: Tag, as: 'tags' },
                { association: 'author', attributes: ['id', 'username', 'email'] }
            ]
        });

        return res.status(200).json({
            message: "Artículo actualizado",
            article: updatedArticle
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar artículo",
            error: error.message
        });
    }
};

export const deleteArticle = async (req, res) => {
    try {
        await req.resource.destroy();
        return res.status(200).json({ message: "Artículo eliminado (lógico)" });
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar artículo",
            error: error.message
        });
    }
};