import { Model, DataTypes, Optional, Op } from 'sequelize';
import sequelize from '../config/db';
import User from './User';
import crypto from 'crypto';
import { OTP_EXPIRATION_MINUTES, OTP_LIMIT_DAYS, OTP_LIMIT_QUANTITY } from '../utils/constants';

export interface IUserPasswordRecoveryAttributes {
  id?: number;
  idUser: number;
  otp: string;
  isUsed: boolean;
  createdAt?: Date;
}

interface IUserPasswordRecoveryCreationAttributes extends Optional<IUserPasswordRecoveryAttributes, 'id'> { }

class UserPasswordRecovery extends Model<IUserPasswordRecoveryAttributes, IUserPasswordRecoveryCreationAttributes>
  implements IUserPasswordRecoveryAttributes {
  public id!: number;
  public idUser!: number;
  public otp!: string;
  public isUsed!: boolean;
  public readonly createdAt!: Date;
  public user?: User;

  static generateOTP(length: number = 8): string {
    const characters = '0123456789';
    const bytes = crypto.randomBytes(length);
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += characters.charAt(bytes.readUInt8(i) % characters.length);
    }
    return otp;
  }

  // Verify OTP limits
  static async isWithinLimits(idUser: number): Promise<boolean> {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - OTP_LIMIT_DAYS);

    const count = await this.count({
      where: {
        idUser,
        createdAt: {
          [Op.gte]: dateLimit,
        },
      },
    });

    return count <= OTP_LIMIT_QUANTITY;
  }

  // Verify OTP validity (expiration, used value, and user email)
  static async getOTPRecordIfValid(otp: string, email: string) {
    return await UserPasswordRecovery.findOne({
      where: {
        otp,
        isUsed: false,
        createdAt: {
          [Op.gte]: new Date(Date.now() - OTP_EXPIRATION_MINUTES * 60 * 1000),
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          where: {
            email: email,
          },
          attributes: ['id', 'email'],
        },
      ],
    });
  }
}

UserPasswordRecovery.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idUser: {
      type: DataTypes.INTEGER,
      field: 'id_user',
      allowNull: false,
      references: {
        model: 'tb_user',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    otp: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        len: {
          args: [1, 15],
          msg: 'OTP must be between 1 and 15 characters',
        },
      },
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      field: 'is_used',
      allowNull: false,
      defaultValue: false,
      validate: {
        isBoolean: {
          msg: 'Used status must be true or false',
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
  },
  {
    sequelize,
    modelName: 'UserPasswordRecovery',
    tableName: 'tb_user_password_recovery',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    freezeTableName: true,
    indexes: [
      { fields: ['idUser'] },
      { fields: ['otp'] },
    ],
  }
);

// Relación con User
UserPasswordRecovery.belongsTo(User, {
  foreignKey: 'idUser',
  as: 'user',
});

export default UserPasswordRecovery;