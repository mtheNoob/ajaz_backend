const express = require("express");
const apiRoutes = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const Post = require("../models/post.model");
const upload = require("../middleware/uploadMiddleware")
const multer = require("multer")
const path = require("path")
module.exports = function (app) {

  // apiRoutes.post("/create-post", upload.single("image"), async (req, res) => {
  //   try {
  //     const { title, description, url } = req.body;

  //     if (!title || !description) {
  //       return res.status(400).json("Title and Description are required");
  //     }

  //     const postExists = await Post.findOne({ title });
  //     if (postExists) {
  //       return res.status(400).json("A post with this title already exists!");
  //     }

  //     const randomPostId = "POST-" + Math.floor(Math.random() * 100000);

  //     const image = req.file ? req.file.filename : "";

  //     const postData = new Post({
  //       postId: randomPostId,
  //       title,
  //       url,
  //       description,
  //       image,
  //     });

  //     await postData.save();

  //     res.status(200).json({
  //       message: "Post created successfully!",
  //       data: postData,
  //     });

  //   } catch (error) {
  //     res.status(500).json(error.message);
  //   }
  // });

  apiRoutes.post("/create-post", upload.single("image"), async (req, res) => {
  try {
    const { title, description, url } = req.body;
    if (!title || !description) {
      return res.status(400).json("Title and Description are required");
    }
    const postExists = await Post.findOne({ title });
    if (postExists) {
      return res.status(400).json("A post with this title already exists!");
    }
    const randomPostId = "POST-" + Math.floor(Math.random() * 100000);
    // :white_check_mark: CLOUDINARY IMAGE URL (PERMANENT)
    const image = req.file ? req.file.path : "";
    const postData = new Post({
      postId: randomPostId,
      title,
      url,
      description,
      image, // :white_check_mark: now stores full permanent cloud URL
    });
    await postData.save();
    res.status(200).json({
      message: "Post created successfully!",
      data: postData,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

  apiRoutes.get("/get-posts", async (req, res) => {
  try {
    const posts = await Post.find();

    res.status(200).json({
      message: "Posts fetched successfully!",
      data: posts,
    });

  } catch (error) {
    res.status(500).json(error.message);
  }
});

apiRoutes.post("/update-post", upload.single("image"), async (req, res) => {
  try {
    const { title, description, postId , url} = req.body;

    // Find the post
    const post = await Post.findOne({ postId });
    if (!post) {
      return res.status(404).json("Post not found");
    }

    // Title duplicate check (only if title changed)
    if (title && title !== post.title) {
      const titleExists = await Post.findOne({ title });
      if (titleExists) {
        return res.status(400).json("A post with this title already exists!");
      }
    }

    // Update fields
    if (title) post.title = title;
        if (url) post.url = url;

    if (description) post.description = description;

    // If new image uploaded
    if (req.file) {
      post.image = req.file.filename;
    }

    await post.save();

    res.status(200).json({
      message: "Post updated successfully!",
      data: post,
    });

  } catch (error) {
    res.status(500).json(error.message);
  }
});

apiRoutes.post("/delete-post", async (req, res) => {
  try {
    const { postId } = req.body;

    const deletedPost = await Post.findOneAndDelete({ postId });

    if (!deletedPost) {
      return res.status(404).json("Post not found");
    }

    res.status(200).json({
      message: "Post deleted successfully!",
      deleted: deletedPost
    });

  } catch (error) {
    res.status(500).json(error.message);
  }
});

  app.use("/", apiRoutes);


}