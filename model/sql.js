import knexLib from 'knex'; 

class ClienteSql {

    constructor(config){
        this.knex = knexLib(config)
    }

    async createTable (){
        try {
            return await this.knex.schema.dropTableIfExists(`productos`);
        } finally {
            return await this.knex.schema.createTable(`productos`, table => {
                table.increments("id_producto").primary();
                table.string("title", 50).notNullable();
                table.string("thumbnail", 50).notNullable();
                table.float("price", 50).notNullable();
                table.integer("stock", 50).notNullable();
            });
        } 
    }
    insertProducts(products){
        
        return this.knex ("productos").insert(products)
    }

 getArticles(){
        try{
        return   this.knex(`productos`).select(`*`)
        console.log(productos)
    }
        catch (error) {
            console.log(error)
            return ["hola"]
            }
    }
    close() {
        return this.knex.destroy();
      }

}
export default ClienteSql;