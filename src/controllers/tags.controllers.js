import { Tag } from '../models/tags.models.js';
import { Article } from '../models/articles.models.js';
import { validationResult } from 'express-validator';

export const createTag = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Errores de validación",
                errors: errors.array()
            });
        }

        const { name } = req.body;

        const existingTag = await Tag.findOne({ where: { name } });
        if (existingTag) {
            return res.status(400).json({ message: "La etiqueta ya existe" });
        }

        const tag = await Tag.create({ name });
        return res.status(201).json({
            message: "Etiqueta creada",
            tag
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear etiqueta",
            error: error.message
        });
    }
};

export const getTags = async (req, res) => {
    try {
        const tags = await Tag.findAll({
            order: [['name', 'ASC']]
        });

        return res.status(200).json(tags);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener etiquetas",
            error: error.message
        });
    }
};

export const getTagById = async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.id, {
            include: [{
                model: Article,
                as: 'articles',
                through: { attributes: [] }
            }]
        });

        if (!tag) {
            return res.status(404).json({ message: "Etiqueta no encontrada" });
        }

        return res.status(200).json(tag);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener etiqueta",
            error: error.message
        });
    }
};

export const updateTag = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Errores de validación",
                errors: errors.array()
            });
        }

        const { name } = req.body;
        const tag = await Tag.findByPk(req.params.id);

        if (!tag) {
            return res.status(404).json({ message: "Etiqueta no encontrada" });
        }

        if (name && name !== tag.name) {
            const exists = await Tag.findOne({ where: { name } });
            if (exists) {
                return res.status(400).json({ message: "El nombre de etiqueta ya está en uso" });
            }
        }

        await tag.update({ name });
        return res.status(200).json({
            message: "Etiqueta actualizada",
            tag
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar etiqueta",
            error: error.message
        });
    }
};

export const deleteTag = async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.id);

        if (!tag) {
            return res.status(404).json({ message: "Etiqueta no encontrada" });
        }

        await tag.destroy();
        return res.status(200).json({ message: "Etiqueta eliminada" });
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar etiqueta",
            error: error.message
        });
    }
};