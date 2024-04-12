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
  const [coffee, wholebean, brew] = await Promise.all([
    createProduct_Type({ name: 'coffee'}),
    createProduct_Type({ name: 'wholebean'}),
    createProduct_Type({ name: 'brew'})
  ]);

  // Users
  const [harry, hermoine, ron] = await Promise.all([
    createUser({ firstName: 'harry', lastName: 'potter', username: 'harry@gmail.com', password: 'hogwarts1'}),
    createUser({ firstName: 'hermoine', lastName: 'granger',username: 'hermoine@gmail.com', password: 'hogwarts2'}),
    createUser({ firstName: 'ron', lastName: 'weasly',username: 'ron@gmail.com', password: 'hogwarts3'})
  ]);

  // Products
  const [ColdBrew, Latte] = await Promise.all([
    createProduct({name: 'Cold Brew', product_price: 4.00, 
    description: 'Black coffee on ice.', 
    img: 'https://www.seriouseats.com/thmb/U-LNa28nrdRi_nRUjcJAjDgtd5g=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/IcedCoffee-9e66377b914346d9b166bf45d2065619.jpg',
     qty_available: 100, product_type: coffee.id}),
    createProduct({name: 'Latte', product_price: 5.00, 
    description: 'Coffee on ice with milk.', 
    img: 'https://www.caffesociety.co.uk/assets/recipe-images/latte-small.jpg',
     qty_available: 100, product_type: coffee.id}),
    createProduct({name: 'Macchiato', product_price: 5.50, 
    description: 'A double shot of espresso, topped with steamed milk',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkevAXm9AtKYpYJg6MB3nv3t8iT2nCcehjSw&s',
    qty_available:'100', product_type: coffee.id}),
    createProduct({name: 'Dirty Chai Latte', product_price: 6.00,
    description: 'Coffee with Chai tea and milk', 
    img: 'https://shottbeverages.com/wp-content/uploads/2020/06/dirty_chai_vanill_latte.jpg',
    qty_available: 100, product_type: coffee.id}),
    createProduct({name: 'Frappucino', product_price: 6.50, 
    description: 'Coffee blended with ice and milk. Topped with whip cream.',
    img: 'https://freshbeanbakery.com/wp-content/uploads/2023/06/CaramelFrap-Photo3-683x1024.jpg',
    qty_available: 100, product_type: coffee.id})
  ]);

  // Carts
  const [ one, two, three ] = await Promise.all([
    createCart({ user_id: harry.id }),
    createCart({ user_id: hermoine.id }),
    createCart({ user_id: ron.id })
  ]);

  console.log(await fetchAllUsers());
  console.log(await fetchAllProducts());
  //console.log(await fetchCarts());

  //Cart Products
  const cartProducts = await Promise.all([
    createCartProduct(one.id, ColdBrew.id, 1),
    createCartProduct(two.id, ColdBrew.id, 1),
    createCartProduct(two.id, Latte.id, 2)
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