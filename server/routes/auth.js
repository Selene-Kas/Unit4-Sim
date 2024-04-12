const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { createUser,
    authenticate,
    findUserByToken
} = require('../db');

//Register (need to save new user to database?)
router.post("/register", async(req,res, next)=> {
    const {firstName, lastName, username, password} = req.body;
    try {
      const user = await createUser({firstName, lastName, username, password});
      delete user.password;
      const token = jwt.sign(user, "secret");
      res.send({user, token});    
    } catch(err){
      next(err);
    }
});

router.post('/login', async(req, res, next)=> {
  const {username, password} = req.body;
  try {
    const user = await authenticate(username, password);
    delete user.password;
    const token = jwt.sign(user, "secret");
    res.send({user, token});    
  } catch(err){
    next(err);
  }
});

// get user (me)
router.get('/me', async(req, res, next)=> {
  try {
    res.send(await findUserByToken(req.headers.authorization));
  }
  catch(ex){
    next(ex);
  }
});
  
  
module.exports = router;