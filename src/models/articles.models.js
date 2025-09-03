import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { User } from "./users.models.js";

export const Article = sequelize.define("Article", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
            len: [3, 200]
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [50, 10000]
        }
    },
    excerpt: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
            len: [0, 500]
        }
    },
    status: {
        type: DataTypes.ENUM('published', 'archived'),
        defaultValue: 'published'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" }
    }
}, {
    tableName: "articles",
    timestamps: true,
    paranoid: true,
    deletedAt: "deleted_at"
});

User.hasMany(Article, {
    foreignKey: "user_id",
    as: "articles",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Article.belongsTo(User, {
    foreignKey: "user_id",
    as: "author"
});