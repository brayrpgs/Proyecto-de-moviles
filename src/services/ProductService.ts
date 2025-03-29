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


  async read(page:number, size:number, queryParams: Record<string, any>) {
    try {
      // Variable for filters from extra params and only on those fields
      const where: Record<string, any> = {};
      const allowedFields = ['id', 'name', 'price', 'store', 'url_indentifier', 'isActive'];
  
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
        attributes: ['url_indentifier', 'name', 'price', 'type_coin', 'store', 'tags', 'id','dateConsulted'],
        where: Object.keys(where).length > 0 ? where : undefined
      });
    } catch(error:any) {
      throw new Error(error.message);
    }
  }
}

