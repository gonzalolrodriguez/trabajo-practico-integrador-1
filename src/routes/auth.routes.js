import { Router } from "express";
import { User } from '../models/users.models.js';
import { Profile } from '../models/profile.models.js';
import { generateToken } from '../helpers/jwt.js';
import { validationResult } from 'express-validator';

const router = Router();
const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Errores de validación",
                errors: errors.array()
            });
        }

        const { username, email, password, first_name, last_name } = req.body;

        const existingUser = await User.findOne({ where: { email }, paranoid: false });
        if (existingUser) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }

        const existingUsername = await User.findOne({ where: { username }, paranoid: false });
        if (existingUsername) {
            return res.status(400).json({ message: "El username ya está en uso" });
        }

        const user = await User.create({
            username,
            email,
            password,
            role: 'user'
        });

        await Profile.create({
            first_name,
            last_name,
            user_id: user.id
        });

        const token = generateToken({ id: user.id, email: user.email, role: user.role });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "Usuario registrado exitosamente",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al registrar usuario",
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Errores de validación",
                errors: errors.array()
            });
        }

        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const isValidPassword = await user.validPassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const token = generateToken({ id: user.id, email: user.email, role: user.role });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login exitoso",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al iniciar sesión",
            error: error.message
        });
    }
};

const logout = (req, res) => {

    res.clearCookie('token');
    return res.status(200).json({ message: "Logout exitoso" });
};

// Rutas de autenticación

import { authMiddleware } from '../middlewares/auth.js';

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/logout", logout);

// obtener perfil del usuario autenticado
router.get("/auth/profile", authMiddleware, async (req, res) => {
    try {

        const profile = await Profile.findOne({ where: { user_id: req.user.id } });
        if (!profile) {
            return res.status(404).json({ message: "Perfil no encontrado" });
        }
        return res.status(200).json({
            user: {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
                role: req.user.role
            },
            profile
        });

    } catch (error) {
        return res.status(500).json({ message: "Error al obtener perfil", error: error.message });
    }
});

// Actualizar perfil del usuario autenticado
import { body } from 'express-validator';
router.put(
    "/auth/profile",
    authMiddleware,
    [
        body("first_name").optional().isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres").isAlpha().withMessage("El nombre solo puede contener letras"),
        body("last_name").optional().isLength({ min: 2, max: 50 }).withMessage("El apellido debe tener entre 2 y 50 caracteres").isAlpha().withMessage("El apellido solo puede contener letras"),
        body("biography").optional().isLength({ max: 500 }).withMessage("La biografía no puede exceder los 500 caracteres"),
        body("avatar_url").optional().isURL().withMessage("El avatar debe ser una URL válida"),
        body("birth_date").optional().isISO8601().withMessage("La fecha de nacimiento debe ser válida")
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: "Errores de validación",
                    errors: errors.array()
                });
            }
            const profile = await Profile.findOne({ where: { user_id: req.user.id } });
            if (!profile) {
                return res.status(404).json({ message: "Perfil no encontrado" });
            }
            const { first_name, last_name, biography, avatar_url, birth_date } = req.body;
            await profile.update({ first_name, last_name, biography, avatar_url, birth_date });
            return res.status(200).json({ message: "Perfil actualizado exitosamente", profile });
        } catch (error) {
            return res.status(500).json({ message: "Error al actualizar perfil", error: error.message });
        }
    }
);

export default router;
