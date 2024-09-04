import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { BaseModel, BaseAttributes } from './base';

interface RoleAttributes extends BaseAttributes {
  id: number;
  role_name: string;
  created_at?: Date;
  updated_at?: Date;
}


interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> { }

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: number;
  public role_name!: string;
  public created_at!: Date;
  public updated_at!: Date;
  public id_external?: string;
}

export default (sequelize: Sequelize) => {
  Role.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    ...BaseModel.initializeAttributes(),
    role_name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'Roles',
    timestamps: true,
    paranoid: true,
  });

  return Role;
};
