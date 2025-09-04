import { User } from '../models/users.models.js';
import { Profile } from '../models/profile.models.js';
import { generateToken } from '../helpers/jwt.js';
import { validationResult } from 'express-validator';

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Errores de validación",
                errors: errors.array()
            });
        }

        const { username, email, password, first_name, last_name } = req.body;

        const existingUser = await User.findOne({
            where: { email },
            paranoid: false
        });

        if (existingUser) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }

        const existingUsername = await User.findOne({
            where: { username },
            paranoid: false
        });

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

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

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

export const login = async (req, res) => {
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

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

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

export const logout = (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: "Logout exitoso" });
};
