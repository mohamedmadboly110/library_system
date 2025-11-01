const Book = require('../models/Book');
const fs = require('fs');
const path = require('path');

// @desc    Get all books with pagination
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments();

    res.status(200).json({
      status: 'success',
      message: 'Books retrieved successfully',
      data: {
        books,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Book retrieved successfully',
      data: {
        book,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private/Admin
exports.createBook = async (req, res, next) => {
  try {
    const { title, author, description } = req.body;
    let image = null;

    // Handle image upload
    if (req.file) {
      image = req.file.path;
    }

    const book = await Book.create({
      title,
      author,
      description,
      image,
    });

    res.status(201).json({
      status: 'success',
      message: 'Book created successfully',
      data: {
        book,
      },
    });
  } catch (error) {
    // Delete uploaded file if book creation fails
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    next(error);
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
exports.updateBook = async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      // Delete uploaded file if book not found
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      return res.status(404).json({
        status: 'error',
        message: 'Book not found',
      });
    }

    const { title, author, description } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (author) updateData.author = author;
    if (description) updateData.description = description;

    // Handle new image upload
    if (req.file) {
      // Delete old image if exists
      if (book.image) {
        const oldImagePath = path.join(__dirname, '..', book.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
      updateData.image = req.file.path;
    }

    book = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Book updated successfully',
      data: {
        book,
      },
    });
  } catch (error) {
    // Delete uploaded file if update fails
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    next(error);
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found',
      });
    }

    // Delete associated image if exists
    if (book.image) {
      const imagePath = path.join(__dirname, '..', book.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting image:', err);
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Book deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};


