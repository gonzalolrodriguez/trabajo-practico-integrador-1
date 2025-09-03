import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT,
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        define: {
            timestamps: true,
            paranoid: true,
            underscored: false,
            freezeTableName: true
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

export const initDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(" Conexión a la base de datos establecida correctamente");

        await sequelize.sync({ force: false, alter: true });
        console.log(" Modelos sincronizados con la base de datos");
    } catch (error) {
        console.error(" Error al conectar con la base de datos:", error.message);
        process.exit(1);
    }
};