import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Article } from "./articles.models.js";
import { Tag } from "./tags.models.js";

export const ArticleTag = sequelize.define("ArticleTag", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    article_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "articles", key: "id" }
    },
    tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "tags", key: "id" }
    }
}, {
    tableName: "article_tags",
    timestamps: true,
    indexes: [
        { unique: true, fields: ["article_id", "tag_id"] }
    ]
});

Article.belongsToMany(Tag, {
    through: ArticleTag,
    as: "tags",
    foreignKey: "article_id",
    otherKey: "tag_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Tag.belongsToMany(Article, {
    through: ArticleTag,
    as: "articles",
    foreignKey: "tag_id",
    otherKey: "article_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});