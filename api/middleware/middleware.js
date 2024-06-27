// const express = require("express")
const userModel = require("../users/users-model")
const postModel = require("../posts/posts-model")

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(`${req.method} ${req.url} ${new Date().toISOString()}`)
  next()
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  try {
    const {id} = req.params
    const user = await userModel.getById(id)
    if (user) {
      req.user = user
      next()
    } else {
      res.status(404).json({message : "user not found"})
    }
  } catch(error) {
    next(error)
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
    const payload = req.body
    if(!payload.name) {
      res.status(400).json({message: "missing required name field"})
    } else {
      next()
    }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const payload = req.body
    if(!payload.text) {
      res.status(400).json({message: "missing required text field"})
    } else {
      req.text = payload
      next()
    }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}