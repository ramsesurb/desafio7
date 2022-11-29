
import { promises as fs } from 'fs';

import ClienteSql from "./model/sql.js"
import { config } from "./config/mariaDB.js";
const sql = new ClienteSql(config);

class Contenedor {
   
    async getAll(){
        try {
           await sql.getArticles()
            .then(items=>{
                console.table(items)
              })
            
        } catch (error) {
        console.log(error)
        return []
        }
    }
    async getByid (id){
        try {
            const prod = await rute.getAll()
            const getByid = prod.filter(e => e.id === id)
            
            return getByid
        } catch (error) {
        console.log(error)
        }

    }
    async deleteById (id){
        try {
            const content = await rute.getAll()
            const deleteByid = content.filter(e => e.id !== id)
            await fs.writeFile(`./api/productos.json`, JSON.stringify(deleteByid ,null, 2))
            console.log(deleteByid)
            return deleteByid
            
            
        } catch (error) {
        console.log(error)
        }

    }
    async deleteAll (){
        try {
            let products = await rute.getAll()
            products = []
           
        } catch (error) {
        console.log(error)
        }

    }
    async save (prod){
        try {
            const saveCont = await this.getAll()
            const lastId = saveCont.length
            const producto = {id:(lastId+1), title: prod.title ,price: prod.price, thumbnail: prod.thumbnail }
            await saveCont.push(producto)
            await fs.writeFile(`./api/productos.json`, JSON.stringify(saveCont ,null, 2))
            return saveCont
           
        } catch (error) {
        console.log(error)
        }
    }

    
}
    
const rute = new Contenedor ("productos.json")
rute.getAll()
export default Contenedor


