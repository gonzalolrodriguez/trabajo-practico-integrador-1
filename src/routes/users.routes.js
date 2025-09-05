import { Router } from "express";
import { body, param } from "express-validator";
import { getUsers, getUserById, updateUser, deleteUser } from "../controllers/users.controllers.js";
import { validate, validateId, validateResourceExists, validateUniqueField } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware } from "../middlewares/admin.js";
import { User } from "../models/users.models.js";

const router = Router();

router.get("/users", authMiddleware, adminMiddleware, getUsers);

router.get(
    "/users/:id",
    [
        param("id").isInt().withMessage("ID debe ser un número entero")
    ],
    validate,
    validateId,
    validateResourceExists(User),
    authMiddleware,
    adminMiddleware,
    getUserById
);

router.put(
    "/users/:id",
    [
        param("id").isInt().withMessage("ID debe ser un número entero"),
        body("email").optional().isEmail().withMessage("Email debe ser válido"),
        body("username").optional().isLength({ min: 3, max: 20 }).withMessage("Username debe tener entre 3 y 20 caracteres"),
        body("role").optional().isIn(['user', 'admin']).withMessage("Rol debe ser 'user' o 'admin'")
    ],
    validate,
    validateId,
    validateResourceExists(User),
    validateUniqueField(User, 'email', 'El email ya está en uso'),
    validateUniqueField(User, 'username', 'El username ya está en uso'),
    authMiddleware,
    adminMiddleware,
    updateUser
);

router.delete(
    "/users/:id",
    [
        param("id").isInt().withMessage("ID debe ser un número entero")
    ],
    validate,
    validateId,
    validateResourceExists(User),
    authMiddleware,
    adminMiddleware,
    deleteUser
);

export default router;