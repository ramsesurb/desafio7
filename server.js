import express from 'express';
import Contenedor from './Contenedor.js';
import ContenedorIo from './ContenedorIo.js';
const productos = new Contenedor('./api/productos.json')
const historial = new ContenedorIo (".api/historialChat.json")

import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';

import ClienteSql from "./model/sql.js"
import { config } from "./config/mariaDB.js";
const sql = new ClienteSql(config);


const app = express();
const httpServer = new HttpServer(app);

const io = new IOServer(httpServer);



  
 

 
   
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }))
  app.set("views", "./public")
  app.set("view engine", "ejs")
  app.get('/',async  (req, res) => {
    res.render('index');
    });
  
    
  
  
  
  io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');
  
    //chat
    socket.emit('mensajes', historial.getChat());
  
    socket.on('new-message', async data => {
      await historial.getChat(data);
      io.sockets.emit('mensajes', historial.getChat());
      
    })
  
    //historial del chat
    const chat = await historial.getChat()
    socket.emit('mensajes', chat )
    socket.on('new-message', async data => {
  
      await historial.saveChat(data)
      const chat2 = await historial.getChat()
      io.sockets.emit('messages', chat2 );
  });
  
   
    // productos
  
  
    const prods = await productos.getAll()
    console.table(prods)
   
    socket.emit("productos", productos.getAll())
  
    socket.on("nuevoProducto", async saveProd => {
      await productos.getAll(saveProd)
      io.sockets.emit("productos",await  productos.getAll() )
  })
  
  //productos save
  
  socket.emit('productos', prods )
  
  socket.on('nuevoProducto', async prod => {
  
    await productos.save(prod)
    const prods2 = await productos.getAll()
    io.sockets.emit('productos', prods2 );
  });
  
  
  });
  
  



const port = 8080;

const server = httpServer.listen(port, () => {
  console.log(`servidor escuchando en http://localhost:${port}`);
});
server.on('error', error => console.log(`Error en servidor ${error}`));