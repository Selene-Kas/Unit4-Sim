const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/users');
const productRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const productTypesRouter = require('./routes/productTypes');
const authRouter = require('./routes/auth');

const { client,
    createTables,
    createUser,
    createProduct,
    createProduct_Type,
    createCart,
    fetchAllUsers,
    fetchAllProducts,
    fetchCartProducts,
    createCartProduct,
    deleteCartProduct
} = require('./db');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/product_types', productTypesRouter);
app.use('/api/auth', authRouter);


const init = async() => {
  await client.connect();
  await createTables();
  console.log('tables created');

  // Product Types 
  const [action, mystery, romance] = await Promise.all([
    createProduct_Type({ name: 'action'}),
    createProduct_Type({ name: 'mystery'}),
    createProduct_Type({ name: 'romance'})
  ]);

  // Users
  const [peter, tony] = await Promise.all([
    createUser({ firstName: 'peter', lastName: 'parker', username: 'peter@gmail.com', password: 'spiderman1'}),
    createUser({ firstName: 'tony', lastName: 'stark',username: 'tony@gmail.com', password: 'stark2'})
  ]);

  // Products
  const [Avengers, Spiderman] = await Promise.all([
    createProduct({name: 'Avengers', product_price: 15.00, 
    description: 'the avengers battle thanos', 
    img: 'https://www.coverwhiz.com/uploads/movies/avengers-infinity-war.jpg',
     qty_available: 100, product_type: action.id}),
    createProduct({name: 'Spiderman', product_price: 15.00, 
    description: 'life of peter parker and his secret life as spiderman', 
    img: 'https://media.comicbook.com/wp-content/uploads/2012/05/538954_379573022086607_109890852388160_1093845_1750201828_n.jpg',
     qty_available: 100, product_type: action.id}),
    createProduct({name: 'Titanic', product_price: 15.50, 
    description: 'rose and jack fall in love',
    img: 'https://i.redd.it/es9pbmd98s6b1.jpg',
    qty_available:'100', product_type: romance.id})
  ]);

  // Carts
  const [ one, two ] = await Promise.all([
    createCart({ user_id: peter.id }),
    createCart({ user_id: tony.id })
  ]);

  console.log(await fetchAllUsers());
  console.log(await fetchAllProducts());
  //console.log(await fetchCarts());

  //Cart Products
  const cartProducts = await Promise.all([
    createCartProduct(one.id, mystery.id, 1),
    createCartProduct(two.id, mystery.id, 1),
    createCartProduct(two.id, action.id, 2)
  ]);
  console.log(await fetchCartProducts(one.id));
  console.log(await fetchCartProducts(two.id));
  await deleteCartProduct(cartProducts[0].id);
  console.log(await fetchCartProducts());
  
  app.listen(3000, () => {
    console.log('server is listening on port 3000!');
  });
};
init();