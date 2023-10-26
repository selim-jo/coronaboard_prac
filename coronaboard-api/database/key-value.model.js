// 다양한 값을 저장하는 범용 API
const { DataTypes } = require('sequelize');
const { sequelize } = require('.');

module.exports = (sequelize) => {
    return sequelize.define(
        'KeyValue',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
            },
            key: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            value: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'KeyValue',
            timestamps: false,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    fields: [{ name: 'id' }],
                },
                {
                    name: 'key',
                    unique: true,
                    fields: [{ name: 'key' }],
                },
            ],
        },
    );
};