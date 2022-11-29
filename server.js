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


sql.createTable()
.then(() => {
  console.log('1. Tabla creada');

  const products = [
    {
      "id_producto": 1,
      "title": "Fender Player Stratocaster HSS",
      "price": 879.99,
      "thumbnail": "https://muzikercdn.com/uploads/products/789/78991/main_9a486311.jpg",
      "stock" : 8

    },
    {
      "id_producto": 2,
      "title": "Squier Bullet Stratocaster",
      "price": 179.99,
      "thumbnail": "https://muzikercdn.com/uploads/products/2863/286399/main_6343f6f3.jpg",
      "stock" : 8
    },
    {
      "id_producto": 3,
      "title": "Ibanez AZ2402",
      "price": 1999.99,
      "thumbnail": "https://muzikercdn.com/uploads/products/6256/625697/main_b504a8bc.jpg",
      "stock" : 8
    },
    {
      "id_producto": 4,
      "title": "Yamaha Pacifica 112VM",
      "price": 319.99,
      "thumbnail": "https://muzikercdn.com/uploads/products/196/19613/main_c65761a5.jpg",
      "stock" : 8
    },
    {
      "id_producto": 5,
      "title": "Yamaha Pacifica 112VM",
      "price": 319.99,
      "thumbnail": "https://muzikercdn.com/uploads/products/196/19613/main_c65761a5.jpg",
      "stock" : 8
    },
    
  ]
  sql.insertProducts(products)
  

 
   .catch((err) => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    sql.close();
  })
})
 sql.getArticles()

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