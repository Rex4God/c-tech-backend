"use strict";
const express = require("express")
const router = express.Router();
const controller = require("../app/controller/BlogController")
const {authenticateUser} = require("../app/middleware/authMiddleware")
const upload = require("../app/utils/imageUploader")


router.post("/create",authenticateUser,  upload.single("image"), controller.createBlog)

router.get("/", controller.getAllBlogs)

router.get("/:blogId", controller.getBlog) 

router.put("/:blogId", authenticateUser, upload.single("image"), controller.updateBlog)

router.delete("/:blogId", authenticateUser, controller.deleteBlog)



module.exports =router