const express = require('express');
const userModel = require("./users-model")
const postModel = require("../posts/posts-model")
const middlewares = require("../middleware/middleware")
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const {
      validateUserId,
      validateUser,
      validatePost} = middlewares

const router = express.Router();

router.get('/',async (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  try{
    const users = await userModel.get()
    res.status(200).json(users)
  }catch (error) {
    next(error)
  }
});

router.get('/:id',validateUserId,(req, res) => {
  // RETURN THE USER OBJECT
  res.status(200).json(req.user)
  // this needs a middleware to verify user id
});

router.post('/',validateUser, async(req, res,next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  try {
    const newUser = await userModel.insert(req.body)
    res.status(201).json(newUser)
  } catch(error) {
    next(error)
  }
  // this needs a middleware to check that the request body is valid
});

router.put('/:id',validateUserId ,validateUser, async (req, res,next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  try {
    const {id} = req.params
    const updatedUser = await userModel.update(id,req.body)
    res.status(200).json(updatedUser)
  } catch(error) {
    next(error)
  }
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.delete('/:id',validateUserId, async(req, res,next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  try {
    const {id} = req.params
    await userModel.remove(id)
    res.status(200).json(req.user)
  } catch(error) {
    next(error)
  }
  // this needs a middleware to verify user id
});

router.get('/:id/posts',validateUserId, async (req, res,next) => {
  // RETURN THE ARRAY OF USER POSTS
  try {
    const posts = await userModel.getUserPosts(req.user.id)
    res.status(200).json(posts)
  } catch(error) {
    next(error)
  }
  // this needs a middleware to verify user id
});

router.post('/:id/posts',validateUserId ,validatePost ,async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  try {
    const payload = req.text
    const newPost = await postModel.insert(payload)
    console.log(newPost)
    res.status(201).json(newPost)
  } catch(error) {
    next(error)
  }
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.use((error,req,res, next) => {
  res.status(error.status || 500)
  .json({
    message: error.message,
    costume_message : "Something went wrong with the users router"
  })
})

// do not forget to export the router
module.exports = router