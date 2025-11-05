const Author = require("../models/author");


const createAuthor = async (req, res) => {
    try {
        const { name, bio, imageUrl, visible, genres } = req.body;
        console.log(" we here 1");

        
        const existingAuthor = await Author.findOne({
            name:   { $regex: new RegExp(`^${name}$`, "i") },
        });
        console.log("2");
        if (existingAuthor) {
            return res.status(400).json({ success: false, message: "Author name already exists" });
        }

        console.log("3");


        const author = new Author({
            name,
            bio,
            imageUrl,
            visible,
            genres,
        });

        const savedAuthor = await author.save();
        console.log("4");

        return res.status(201).json({
            success: true,
            message: "Author created successfully",
            data: savedAuthor,
        });
        console.log("5");

    } catch (error) {
        console.error("Error creating author:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};



const getAllAuthors = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      visible,
      sortBy = "createdAt",
      order = "desc", 
    } = req.query;

    const query = {};
    if (visible !== undefined) query.visible = visible === "true";

    
    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.max(parseInt(limit), 1);

   
    const sortDirection = order === "asc" ? 1 : -1;
    const sortOptions = { [sortBy]: sortDirection };

    
    const total = await Author.countDocuments(query);

    
    const authors = await Author.find(query)
      .sort(sortOptions)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    
    if (authors.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No authors found",
         data: [],
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
       
      });
    }

    
    return res.status(200).json({
      success: true,
      message: "Authors fetched successfully",
      
    //   sort: {
    //     sortBy,
    //     order,
    //   },
      data: authors,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching authors:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


const getAuthorById = async (req, res) => {
    try {
        const { id } = req.params;
        const author = await Author.findById(id);

        if (!author) {
            return res.status(404).json({ success: false, message: "Author not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Author fetched successfully",
            data: author,
        });
    } catch (error) {
        console.error("Error fetching author:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


const updateAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, bio, imageUrl, visible, genres } = req.body;

        
        if (name) {
            const existingAuthor = await Author.findOne({
                _id: { $ne: id },
                name: { $regex: new RegExp(`^${name}$`, "i") },
            });

            if (existingAuthor) {
                return res.status(400).json({ success: false, message: "Another author already uses this name" });
            }
        }

        const updatedAuthor = await Author.findByIdAndUpdate(
            id,
            {
                name,
                bio,
                imageUrl,
                visible,
                genres,
                updatedAt: Date.now(),
            },
            { new: true, runValidators: true }
        );

        if (!updatedAuthor) {
            return res.status(404).json({ success: false, message: "Author not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Author updated successfully",
            data: updatedAuthor,
        });
    } catch (error) {
        console.error("Error updating author:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


const deleteAuthor = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAuthor = await Author.findByIdAndDelete(id);

        if (!deletedAuthor) {
            return res.status(404).json({ success: false, message: "Author not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Author deleted successfully",
            data: deletedAuthor,
        });
    } catch (error) {
        console.error("Error deleting author:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

module.exports = {
    createAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor,
    deleteAuthor,
};
