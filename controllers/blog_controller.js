const Article = require("../models/article");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");




const getAllArticles = async (req, res) => {
  try {
    
    let { page = 1, limit = 5, visible, sort = "desc" } = req.query;

    
    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination values. Page and limit must be positive integers.",
      });
    }

    
    const filter = {};
    if (visible === "true") filter.visible = true;
    if (visible === "false") filter.visible = false;

    
    const totalArticles = await Article.countDocuments(filter);

    
    const totalPages = Math.ceil(totalArticles / limit);
    const skip = (page - 1) * limit;

   
    const articles = await Article.find(filter)
      .sort({ createdAt: sort === "asc" ? 1 : -1 }) 
      .skip(skip)
      .limit(limit);

    
    if (!articles || articles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No articles found.",
        data: [],
      });
    }

    
    return res.status(200).json({
      success: true,
      message: "Articles retrieved successfully.",
      data: articles,
      pagination: {
        currentPage: page,
        totalPages,
        pageSize: limit,
        totalArticles,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });

  } catch (error) {
    console.error(error);

    // 8️⃣ Handle server errors
    return res.status(500).json({
      success: false,
      message: "Internal server error. Could not fetch articles.",
      error: error.message,
    });
  }
};



const postArticle = async (req, res) => {
    try {
        // 1️⃣ Extract input from request body
        const { title, content, author, visible, imageUrl, genre } = req.body;

        // 2️⃣ Basic validation before saving to database
        if (!title || !content || !author) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: title, content, or author.",
            });
        }

        // 3️⃣ Create a new article instance
        const article = new Article({
            title,
            content,
            author,
            visible,
            imageUrl,
            genre,
        });

        // 4️⃣ Save the article
        const savedArticle = await article.save();

        // 5️⃣ Respond with success message
        return res.status(201).json({
            success: true,
            message: "Article successfully added.",
            data: savedArticle,
        });

    } catch (error) {
        console.error(error);

        // 6️⃣ Handle validation errors from Mongoose
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: messages,
            });
        }

        // 7️⃣ Handle any other unexpected errors
        return res.status(500).json({
            success: false,
            message: "Server Error - Could not save article.",
            error: error.message,
        });
    }
};



const updateArticle = async (req, res) => {
    try {


        const articleId = req.params.id.trim().toString();

        const updateData = req.body;

        console.log("is valid?" + mongoose.Types.ObjectId.isValid(articleId));

        // Ensure the ID is a valid ObjectId
        if (!ObjectId.isValid(articleId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid article ID format.",
            });
        }

        updateData.updatedAt = new Date();
        updateData.publishedAt = (updateData.visble == true) ? new Date() : null;
        const result = await Article.updateOne(
            { _id: new mongoose.Types.ObjectId(articleId) },
            { $set: { updateData } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Article not found.",
            });
        }


        // 6️⃣ Success response
        return res.status(200).json({
            success: true,
            message: "Article updated successfully.",
            data: updateData,
        });

    } catch (error) {
        console.error(error);

        // 7️⃣ Handle validation errors from Mongoose
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: messages,
            });
        }

        // 8️⃣ Catch-all server error
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
            error: error.message,
        });
    }
};



const deleteArticle = async (req, res) => {
  try {
    const articleId = req.params.id?.trim();

    
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Article ID format.",
      });
    }

    
    const result = await Article.deleteOne({ _id: new mongoose.Types.ObjectId(articleId) });

    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Article not found or already deleted.",
      });
    }

    
    return res.status(200).json({
      success: true,
      message: "Article deleted successfully.",
    });

  } catch (error) {
    console.error("Delete Error:", error);

    
    return res.status(500).json({
      success: false,
      message: "Internal server error. Could not delete article.",
      error: error.message,
    });
  }
};

module.exports = { getAllArticles, postArticle, updateArticle,deleteArticle };