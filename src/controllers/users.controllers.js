import { User } from '../models/users.models.js';
import { Profile } from '../models/profile.models.js';
import { Article } from '../models/articles.models.js';
import { validationResult } from 'express-validator';

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [
                { model: Profile, as: 'profile' },
                { model: Article, as: 'articles' }
            ],
            attributes: { exclude: ['password'] },
            paranoid: false
        });

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener usuarios",
            error: error.message
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: [
                { model: Profile, as: 'profile' },
                { model: Article, as: 'articles' }
            ],
            attributes: { exclude: ['password'] },
            paranoid: false
        });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener usuario",
            error: error.message
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Errores de validación",
                errors: errors.array()
            });
        }

        const { username, email, role } = req.body;
        const user = await User.findByPk(req.params.id, { paranoid: false });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (email && email !== user.email) {
            const exists = await User.findOne({
                where: { email },
                paranoid: false
            });
            if (exists && exists.id !== user.id) {
                return res.status(400).json({ message: "Email ya en uso" });
            }
        }

        if (username && username !== user.username) {
            const exists = await User.findOne({
                where: { username },
                paranoid: false
            });
            if (exists && exists.id !== user.id) {
                return res.status(400).json({ message: "Username ya en uso" });
            }
        }

        await user.update({ username, email, role });

        const updatedUser = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            paranoid: false
        });

        return res.status(200).json({
            message: "Usuario actualizado",
            user: updatedUser
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar usuario",
            error: error.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await user.destroy();
        return res.status(200).json({ message: "Usuario eliminado (lógico)" });
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar usuario",
            error: error.message
        });
    }
};