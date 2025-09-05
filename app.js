import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { initDB } from "./src/config/database.js";

import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/users.routes.js";
import articleRoutes from "./src/routes/articles.routes.js";
import tagRoutes from "./src/routes/tags.routes.js";
import articleTagRoutes from "./src/routes/article_tags.routes.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", articleRoutes);
app.use("/api", tagRoutes);
app.use("/api", articleTagRoutes);

app.get("/api/health", (req, res) => {
    res.status(200).json({
        message: "Servidor funcionando correctamente",
        timestamp: new Date().toISOString()
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Error interno del servidor",
        error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
});

app.use((req, res) => {
    res.status(404).json({
        message: "Ruta no encontrada",
        path: req.path
    });
});

const PORT = process.env.PORT;

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
});