const express = require('express');
const router = express.Router();
const { fetchProduct_Types,
    fetchProductsOfType
} = require('../db');

//get route product_types 
router.get('/', async(req,res,next)=> {
  try {
    res.send(await fetchProduct_Types());
  } catch(ex) {
    next(ex);
  }
});
  
//get products of product type
router.get('/:id', async(req, res, next)=> {
  try {
    res.send(await fetchProductsOfType(req.params.id));
  } catch(ex) {
    next(ex);
  }
});
  
module.exports = router;