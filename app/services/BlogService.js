"use strict";
const { StatusCodes } = require("http-status-codes")
const blogValidator = require("../validators/BlogValidator")
const { resolveRequestQueryToMongoDBQuery } = require("../utils/helpers")
const blogRepository = require("../repositories/BlogRepository")
const cloudinary = require("../utils/cloudinary")


exports.createBlog = async (body, file) => {
   try {

      const validatorError = await blogValidator.createBlog(body)

      if (validatorError) {
         return {
            error: validatorError,
            statusCode: StatusCodes.BAD_REQUEST,
         }
      }
      const result = await cloudinary.uploader.upload(file.path, {
         folder: "c-tech/blog_images",
         use_filename: true,
         unique_filename: false,
         overwrite: true
      });

      const blog = await blogRepository.create({
         blogTitle: body.blogTitle,
         blogBody: body.blogBody,
         author: body.author,
         date: body.date,
         image: result.secure_url,
         cloudinaryId: result.public_id
      })

      return {
         data: blog,
         statusCode: StatusCodes.CREATED,
      }

   } catch (e) {
      console.log("An unknown error has occurred. Please try again later." + e)
      return {
         error: e.message,
         statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      }
   }
}

exports.getAllBlogs = async (requestParams) => {
   try {
      const mongodbQuery = resolveRequestQueryToMongoDBQuery(requestParams);

      const blogs = await blogRepository.all(mongodbQuery.filter,
            mongodbQuery.sort,
            mongodbQuery.page,
            mongodbQuery.limit)

      return {
         data: blogs,
         statusCode: StatusCodes.OK,
      }

   } catch (e) {
      console.log("An unknown error has occurred. Please try again later." + e)
      return {
         error: e.message,
         statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      }
   }
}

exports.getBlog = async (blogId) => {
   try {

      const blog = await blogRepository.findOne({ _id: blogId })

      if (!blog) {
         return {
            error: "Oops! This blog detail is not found on this platform",
            statusCode: StatusCodes.NOT_FOUND,
         }
      }

      return {
         data: blog,
         statusCode: StatusCodes.OK,
      }

   } catch (e) {
      console.log("An unknown error has occurred. Please try again later." + e)
      return {
         error: e.message,
         statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      }
   }
}

exports.updateBlog = async (blogId, body, file) => {
   try {
      const validatorError = await blogValidator.updateBlog(body)

      if (validatorError) {
         return {
            error: validatorError,
            statusCode: StatusCodes.BAD_REQUEST,
         }
      }

      let result;
      if (file) {
         result = await cloudinary.uploader.upload(file.path, {
            folder: "c-tech/blog_images",
            use_filename: true,
            unique_filename: false,
            overwrite: true
         });
      };
      const updateData = {
         blogTitle: body.blogTitle,
         blogBody: body.blogBody,
         author: body.author,
         date: body.date,
         image: result?.secure_url,
         cloudinaryId: result?.public_id
      }

      const updatedBlog = await blogRepository.update({ _id: blogId }, updateData, { new: true })

      if (!updatedBlog) {
         return {
            error: "Oops! This blog detail is not found on this platform",
            statusCode: StatusCodes.NOT_FOUND,
         }
      }

      return {
         data: updatedBlog,
         statusCode: StatusCodes.OK,
      }

   } catch (e) {
      console.log("An unknown error has occurred. Please try again later." + e)
      return {
         error: e.message,
         statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      }
   }
}

exports.deleteBlog = async (blogId) => {
   try {
      const blog = await blogRepository.findOne({ _id: blogId });

      if (!blog) return {
         error: "Oops! This blog detail is not found on the platform. Hence it cannot be deleted",
         statusCode: StatusCodes.NOT_FOUND
      };
      await blogRepository.deleteMany({ _id: blogId });

      await cloudinary.uploader.destroy(blog.cloudinaryId);

      return {
         data: blogId,
         statusCode: StatusCodes.OK
      }
   } catch (e) {
      console.log("An unknown error has occurred. Please try again later:" + e);
      return {
         error: e.message,
         statusCode: StatusCodes.INTERNAL_SERVER_ERROR
      };
   }
};
