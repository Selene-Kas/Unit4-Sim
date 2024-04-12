const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { fetchAllUsers,
    fetchUser,
    deleteUser
} = require('../db');
// get all users
router.get('/', async (req,res, next)=> {
  try{
    res.send(await fetchAllUsers());
  } catch(ex) {
    next(ex);
  }
});
// get single user
router.get('/:userId', async (req,res, next)=> {
  try{
    res.send(await fetchUser(req.params.userId));
  } catch(ex) {
    next(ex);
  }
});

router.delete('/:id', requireToken,  async(req,res,next)=> {
  try{
    await deleteUser(req.params.id);
    res.sendStatus(204);
  } catch(err) {
    next(err);
  }
});

//PROTECTED GET ALL USERS ROUTE (middleware)
function requireToken(req, res, next) {
    const token = req.headers.authorization;
    try {
         const user = jwt.verify(token, "secret");
         req.user = user;
         next();
    } catch(err) {
        next(err);
    }
}

