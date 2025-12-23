import { z } from "astro:content";
import { defineAction } from "astro:actions";
import { count, db , Properties, PropertiesImages, sql} from "astro:db";
import type { PropertiesWithImages , PropertyRow } from "@/types";
import { mapPropertyRow } from "@/mappers/property.mapper";


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
    
    // total de registros
    const [totalRecords ] = await db.select({ count:count() }).from(Properties);
    const totalPages = Math.ceil(totalRecords.count / limit);
    const offset = (page - 1) * limit;

    
    // pagina permitida  -> sin el row query image properties
    // const properties = await db
    // .select()
    // .from(Properties)
    // .limit(limit)
    // .offset((page-1) * offset);
    // tomo todos los registros de la tabla de propiedades limite de 10 por pagina, si estoy en la pagina 1 quiero 10 registros, si estoy en la pagina 2 quiero los siguientes 10 registros.



    // Row query image properties 
  const propertiesQuery = sql`
        SELECT a.*,
        (
          SELECT json_group_array(image)
          FROM (
            SELECT image 
            FROM ${PropertiesImages}
            WHERE propertyId = a.id 
            LIMIT 2
          )
        ) AS images
        FROM ${Properties} a
        LIMIT ${limit}
        OFFSET ${offset};
      `; 


  const {rows}= await db.run(propertiesQuery);
  // testing fetch data from 2 tables into 1 object 
  // console.log("RAW ROW:", rows[0]);

   // 🔴 puente inevitable en Astro DB
    const typedRows = rows as unknown as PropertyRow[];

    // ✅ dominio limpio
    const properties = typedRows.map(mapPropertyRow);
    // testing mapped data [Aquí confirmamos:JSON parseado, Booleans correctos, Shape final para el front]
    // console.log("MAPPED PROPERTY:", properties[0]);
  
    
    return{
      // relaciones | agrego el típado estricto para las propiedades con imágenes
      // properties: rows as unknown as PropertiesWithImages[],
      properties: properties,
      totalPages,
      currentPage: page,
      totalRecords: totalRecords.count  


    }
  },


  
});
