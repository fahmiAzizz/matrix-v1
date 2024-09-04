import { Model, DataTypes, Sequelize } from 'sequelize';

interface BaseAttributes {
    id_external?: string;
}

abstract class BaseModel<TAttributes extends BaseAttributes> extends Model<TAttributes> implements BaseAttributes {
    public id_external!: string;

    static initializeAttributes() {
        return {
            id_external: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                unique: true,
            }
        };
    }
}

export { BaseAttributes, BaseModel };
