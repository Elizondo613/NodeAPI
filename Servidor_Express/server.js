const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');
require('dotenv').config();
const app = express();
//Swagger
const swaggerSpec = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "NodeApi",
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: [`${path.join(__dirname, "./server.js")}`]
}

let productos = [
    {
        id: 01,
        nombre: 'playera eternal',
        precio: 300,
        marca: 1,
        linea: 3
    },
    {
        id: 02,
        nombre: 'sudadera invencible',
        precio: 400,
        marca: 1,
        linea: 3
    },
    {
        id: 03,
        nombre: 'total 90',
        precio: 550,
        marca: 1,
        linea: 3
    }
]

app.use(express.json())
app.use(morgan('dev')) //Muestra en consola los endpoints visitados
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)))

//JWT - - - - - - - - - - - - -
/**
 * @swagger
 *  components:
 *      schemas:
 *          user:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      decription: the user id
 *                  name:
 *                      type: string
 *                      decription: the user name
 *                  email:
 *                      type: string
 *                      description: the user email
 *              required:
 *                  - id
 *                  - name
 *                  - email
 *              example:
 *                  id: 001
 *                  name: jose
 *                  email: jose@gmail.com
 */

/**
 * @swagger
 *  /api/login:
 *      post:
 *          summary: login the user
 *          tags: [user]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/user'
 *          responses:
 *              200:
 *                  description: user login!
 */

app.post('/api/login', (req, res) => {
    const user = {
        id: 1,
        nombre: "Javi",
        email: "javi@gmail.com"
    }

    //Token generado para validar acceso
    jwt.sign({user: user}, 'secretKey', (err, token) => {
        res.json({
            token
        })
    });
})

//Inventario - - - - - - - - - - -
app.get('/', (req, res) => {
    res.send('Inicio de api');
});

//Obtener listado de productos
/**
 * @swagger
 * components:
 *  schemas:
 *      productos:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: id of product
 *              name:
 *                  type: string
 *                  description: name of product
 *              price:
 *                  type: integer
 *                  description: price of product
 *              mark:
 *                  type: integer
 *                  description: mark of product
 *              line:
 *                  type: integer
 *                  description: line of product
 *          required:
 *              - id
 *              - name
 *              - price
 *              - mark
 *              - line
 *          example:
 *              id: 01
 *              name: playera Larr
 *              price: 100
 *              mark: 1
 *              line: 3          
 */

/**
 * @swagger
 *  /api/productos:
 *      get:
 *          summary: return all the products
 *          tags: [productos]
 *          responses:
 *              200:
 *                  description: all products
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/productos'
 */
app.get('/api/productos', (req, res) => {

            res.json({ productos })
  
})

//Obtener producto por id
/**
 * @swagger
 *  /api/productos/{id}:
 *      get:
 *          summary: return product by id
 *          tags: [productos]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: string
 *                required: true
 *                description: the product id
 *          responses:
 *              200:
 *                  description: only one product
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              $ref: '#/components/schemas/productos'
 *              404:
 *                  description: product not found
 */
app.get('/api/productos/:id', (req, res) => {

            let id = req.params.id
            let response = productos.filter((producto) => producto.id == id)
            res.json(response)
       
})

//Nuevo producto
/**
 * @swagger
 *  /api/productos:
 *      post:
 *          summary: new product
 *          tags: [productos]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/productos'
 *          responses:
 *              200:
 *                  description: new product added!
 */
app.post('/api/productos', (req, res) => {
            let producto = {
                id: productos[productos.length - 1].id + 1, //id incrementable
                nombre: req.body.nombre,
                precio: req.body.precio,
                marca: req.body.marca,
                linea: req.body.linea
            }
        
            productos.push(producto)
            res.json( producto )
       
})

//actualizar producto
/**
 * @swagger
 *  /api/productos/{id}:
 *      put:
 *          summary: update product
 *          tags: [productos]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: string
 *                required: true
 *                description: the product id
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/productos'
 *          responses:
 *              200:
 *                  description: new product added!
 *              404:
 *                  description: product not foud
 */
app.put('/api/productos/:id', (req, res) => {
            let id = req.params.id
            let tmpProducto = {}
        
            //recorre productos para encontrar id
            for(let producto of productos){
                if(producto.id == id){
                    producto.nombre = req.body.nombre
                    producto.precio = req.body.precio
                    producto.marca = req.body.marca
                    producto.linea = req.body.linea
                    tmpProducto = producto
                }
            }
        
            if(tmpProducto != {}){
                res.status(200).json(tmpProducto)
            }else{
                res.status(404).send('Producto no encontrado, error 404')
            }
})

//Eliminar producto
/**
 * @swagger
 *  /api/productos/{id}:
 *      delete:
 *          summary: delete a product by id
 *          tags: [productos]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: string
 *                required: true
 *                description: the product id
 *          responses:
 *              200:
 *                  description: product deleted
 *              404:
 *                  description: product not found
 */
app.delete('/api/productos/:id', (req, res) => {
            let productoTmp = productos.filter((producto) => req.params.id != producto.id)
    
            if(productoTmp.length == productos.length){
                res.status(404).json({result: "Producto no encontrado"})
            }else{
                productos = productoTmp
                res.status(200).json({result: 1})
            } 
})

//Función para verificar token
//Authorization: Bearer <token>
function verifyToken(req, res, next){
    const bearerHeader = req.headers['Authorization'];

    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(" ")[1]; //Toma Bearer <token>, hace el espacio y toma el token [1]
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }
}

app.listen(3000, () => {
    console.log('Server on port 3000');
});