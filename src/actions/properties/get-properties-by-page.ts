import { defineAction } from "astro:actions";
import { z } from "astro:content";
import { count, db , Properties} from "astro:db";

export const getPropertiesByPage = defineAction({
  accept: "json",
  input: z.object({
    page: z.number().optional().default(1),
    limit:z.number().optional().default(10),

  }),

  handler: async ({page, limit}) => {
    // validation 
    page = page <=0 ? 1 : page;
    // limit = limit <=0 ? 10 : limit;
    

    const [totalRecords ] = await db.select({ count:count() }).from(Properties);
    const totalPages = Math.ceil(totalRecords.count / limit);
    const offset = (page - 1) * limit;

    
        // pagina permitida 
    const properties = await db
    .select()
    .from(Properties)
    .limit(limit)
    .offset((page-1) * 10);
    // tomo todos los registros de la tabla de propiedades limite de 10 por pagina, si estoy en la pagina 1 quiero 10 registros, si estoy en la pagina 2 quiero los siguientes 10 registros.
    
    return{
      // relaciones
      properties: properties,
      totalPages,
      currentPage: page,
      totalRecords: totalRecords.count  


    }
  },


  
});
