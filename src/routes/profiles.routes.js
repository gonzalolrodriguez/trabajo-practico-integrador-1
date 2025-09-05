import { User } from '../models/users.models.js';
import { Profile } from '../models/profile.models.js';
import { validationResult } from 'express-validator';

export const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: [{
                model: Profile,
                as: 'profile',
                attributes: ['first_name', 'last_name', 'biography', 'avatar_url', 'birth_date']
            }],
            attributes: ['id', 'username', 'email', 'role', 'createdAt']
        });

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener perfil",
            error: error.message
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Errores de validación",
                errors: errors.array()
            });
        }

        const { first_name, last_name, biography, avatar_url, birth_date } = req.body;

        const [updated] = await Profile.update(
            { first_name, last_name, biography, avatar_url, birth_date },
            { where: { user_id: req.user.id } }
        );

        if (!updated) {
            return res.status(404).json({ message: "Perfil no encontrado" });
        }

        const profile = await Profile.findOne({ where: { user_id: req.user.id } });
        return res.status(200).json({
            message: "Perfil actualizado",
            profile
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar perfil",
            error: error.message
        });
    }
};
