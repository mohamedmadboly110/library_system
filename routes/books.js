const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const {
  validate,
  createBookSchema,
  updateBookSchema,
} = require('../utils/validation');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'book-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter,
});

// @route   GET /api/books
// @desc    Get all books with pagination
// @access  Public
router.get('/', getBooks);

// @route   GET /api/books/:id
// @desc    Get single book by ID
// @access  Public
router.get('/:id', getBook);

// @route   POST /api/books
// @desc    Create a new book
// @access  Private/Admin
router.post(
  '/',
  protect,
  adminOnly,
  upload.single('image'),
  validate(createBookSchema),
  createBook
);

// @route   PUT /api/books/:id
// @desc    Update a book
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  adminOnly,
  upload.single('image'),
  validate(updateBookSchema),
  updateBook
);

// @route   DELETE /api/books/:id
// @desc    Delete a book
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, deleteBook);

module.exports = router;


