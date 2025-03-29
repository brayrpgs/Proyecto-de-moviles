import bcrypt from 'bcryptjs';
import Product from '../models/Product';
import { Identifier, Op } from 'sequelize';

export class ProductService {
  
  async create(product:any) {

    try{
      
        
      const { id, url_indentifier, name, summary, price, type_coin, dateConsulted,store,tags,isActive,createdAt,updatedAt } = await Product.create(product);
      
      return { id, url_indentifier, name, summary, price, type_coin, dateConsulted,store,tags,isActive,createdAt,updatedAt}
      
    } catch (error: any) {
      console.error("Error al crear el producto:", error); // Muestra el error en la consola
      
  } 
}
}
/*
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
  
      return await Product.findAndCountAll({
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
      const user = await Product.findByPk(id);
      if (!user) {
        throw new Error("User not found"); 
      }
          
      // Updating user with its new data
      user.set({
        ...user.get(), 
        ...userData, 
      });

      

      const { id, urlIdentifier, name, summary, price, typeCoin, dateConsulted,store,tags,isActive,createdAt,updatedAt } = await user.save(); // Saving changes to database
      return { id, urlIdentifier, name, summary, price, typeCoin, dateConsulted,store,tags,isActive,createdAt,updatedAt}
    } catch(error: any) {
      throw new Error(error.message);
    }
  }
  
  async delete(id:Identifier) {
    try{
      // Getting the user using the id taken from req path
      const user = await Product.findByPk(id)
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

      const { id, urlIdentifier, name, summary, price, typeCoin, dateConsulted,store,tags,isActive,createdAt,updatedAt} = await user.save(); // Saving changes to database
      return { id, urlIdentifier, name, summary, price, typeCoin, dateConsulted,store,tags,isActive,createdAt,updatedAt}
    } catch(error:any) {
      throw new Error(error.message);
    }
  } 

  // Method to find a user by email
  async findByEmail(email: string) {
    try {
      const user = await Product.findOne({
        where: { email },
        attributes: ['email', 'password', 'isActive'],
      });
  
      if (!user) {
        throw new Error("User not found");
      }
  
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
*/

