const mongoose = require("mongoose");
const Genre = require("../models/genre"); // adjust path as needed


const createGenre = async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Genre name is required.",
      });
    }

    
    const existing = await Genre.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Genre already exists.",
      });
    }

    const genre = new Genre({
      name,
      description,
      imageUrl: imageUrl || null,
      visible: true, 
      publishedAt: new Date(), 
    });

    await genre.save();

    return res.status(201).json({
      success: true,
      message: "Genre created successfully.",
      data: genre,
    });
  } catch (error) {
    console.error("Error creating genre:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating genre.",
      error: error.message,
    });
  }
};


const getAllGenres = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      visible,
      search,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};

    if (visible !== undefined) query.visible = visible === "true";

    if (search && search.trim() !== "") {
      const regex = new RegExp(search, "i");
      query.$or = [{ name: regex }, { description: regex }];
    }

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.max(parseInt(limit), 1);
    const sortDirection = order === "asc" ? 1 : -1;
    const sortOptions = { [sortBy]: sortDirection };

    const total = await Genre.countDocuments(query);

    const genres = await Genre.find(query)
      .sort(sortOptions)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    if (genres.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No genres found.",
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Genres fetched successfully.",
     
      data: genres,
       pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
     // sort: { sortBy, order },
    });
  } catch (error) {
    console.error("Error fetching genres:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching genres.",
      error: error.message,
    });
  }
};


const getGenreById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Genre ID.",
      });
    }

    const genre = await Genre.findById(id);
    if (!genre) {
      return res.status(404).json({
        success: false,
        message: "Genre not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Genre fetched successfully.",
      data: genre,
    });
  } catch (error) {
    console.error("Error fetching genre:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching genre.",
      error: error.message,
    });
  }
};


const updateGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, visible, imageUrl } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Genre ID." });
    }

    // Check for duplicate name (exclude current)
    if (name) {
      const existing = await Genre.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${name}$`, "i") },
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Another genre with this name already exists.",
        });
      }
    }

    const updatedGenre = await Genre.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(imageUrl && { imageUrl }),
        ...(visible !== undefined && { visible }),
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedGenre) {
      return res.status(404).json({
        success: false,
        message: "Genre not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Genre updated successfully.",
      data: updatedGenre,
    });
  } catch (error) {
    console.error("Error updating genre:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating genre.",
      error: error.message,
    });
  }
};


const deleteGenre = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Genre ID.",
      });
    }

    const result = await Genre.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Genre not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Genre deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting genre:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting genre.",
      error: error.message,
    });
  }
};

module.exports = {
  createGenre,
  getAllGenres,
  getGenreById,
  updateGenre,
  deleteGenre,
};
