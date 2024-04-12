const express = require('express');
const router = express.Router();
const { fetchAllProducts, 
    fetchProduct, 
    createProduct,
    deleteProduct 
} = require('../db');

// get route for all products
router.get('/', async(req,res,next)=> {
  try {
    res.send(await fetchAllProducts());
  } catch(ex) {
    next(ex);
  }
});

// get route for single product with id 
router.get('/:id', async(req, res, next)=> {
  try {
    res.send(await fetchProduct(req.params.id));
  } catch(ex) {
    next(ex);
  }
});

// add product to products
router.post('/', async(req, res, next)=> {
  const { name, product_price, description, img, qty_available, product_type} = req.body;
  try {
    res.status(201).send(await createProduct({name, product_price, description, img, qty_available, product_type}));
  } catch(ex) {
    next(ex);
  }
});

// remove product from products
router.delete('/:id', async(req,res,next)=> {
  try{
    await deleteProduct(req.params.id);
    res.sendStatus(204);
  } catch(err) {
    next(err);
  }
});
module.exports = router;