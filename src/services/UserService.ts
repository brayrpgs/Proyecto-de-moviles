import bcrypt from 'bcryptjs';
import User from '../models/User';
import { Identifier, Op } from 'sequelize';

export class UserService {
  
  async create(userData:any) {
    try{
      const hashedPassword = userData.password ? await bcrypt.hash(userData.password, 12) : null;
      const newUser = {
        ...userData,
        password: hashedPassword
      }

      const { id, username, email, firstName, lastName, avatarUrl, isActive} = await User.create(newUser);
      return { id, username, email, firstName, lastName, avatarUrl, isActive}
    } catch(error:any) {
      throw new Error(error.message);
    }
  } 

  async read(page:number, size:number, queryParams: Record<string, any>) {
    try {
      // Variable for filters from extra params and only on those fields
      const where: Record<string, any> = {};
      const allowedFields = ['id', 'username', 'email', 'firstName', 'lastName', 'isActive'];
  
      // Maping of filters
      for (const [key, value] of Object.entries(queryParams)) {
        if (allowedFields.includes(key)) {
          if (key === 'isActive') {
            where[key] = value === 'true'; // Convert string to boolean
          } 
          
          else if (key === 'id') {
            where[key] = value; // Exact match for IDs
          }

          else {
            where[key] = { [Op.iLike]: `%${value}%` }; // Case-insensitive search
          }
        }
      }
  
      return await User.findAndCountAll({
        limit: size,
        offset: (page - 1) * size,
        attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'avatarUrl', 'isActive'],
        where: Object.keys(where).length > 0 ? where : undefined
      });
    } catch(error:any) {
      throw new Error(error.message);
    }
  }

  async update(id: Identifier, userData: any) {
    try {
      // Getting the user using the id taken from req path
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("User not found"); 
      }
          
      // Updating user with its new data
      user.set({
        ...user.get(), 
        ...userData, 
      });

      // If needed to hash the new password it's also needed to put it in the new data
      const hashedPassword = userData.password ? await bcrypt.hash(userData.password, 12) : null;
      if (hashedPassword) {
        user.set({
          password: hashedPassword
        });
      }

      const { id: userId, username, email, firstName, lastName, avatarUrl, isActive } = await user.save(); // Saving changes to database
      return { id, username, email, firstName, lastName, avatarUrl, isActive}
    } catch(error: any) {
      throw new Error(error.message);
    }
  }
  
  async delete(id:Identifier) {
    try{
      // Getting the user using the id taken from req path
      const user = await User.findByPk(id)
      if(!user){
        throw new Error("User not found"); 
      }

      // If it's already deleted
      if(!user.isActive){
        throw new Error("User already deleted"); 
      }
        
      user.set({
        ...user.get(), 
        isActive: false, // Changing this value for logic deleting
      });

      const { id: userId, username, email, firstName, lastName, avatarUrl, isActive } = await user.save(); // Saving changes to database
      return { id, username, email, firstName, lastName, avatarUrl, isActive}
    } catch(error:any) {
      throw new Error(error.message);
    }
  } 

  // Method to find a user by email
  async findByEmail(email: string) {
    try {
      const user = await User.findOne({
        where: { email },
        attributes: ['email', 'password', 'isActive'],
      });
  
      if (!user) {
        return {
            id: 0,
            email: '',
            username: '',
            password: '',
            isActive: false,
            
        } as User; 
    }
  
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

}
