const express = require("express");

const { body } = require("express-validator");

const bookController = require("../controllers/book-controller");

const isAuthenticated = require("../middlewares/auth");

const router = express.Router();

// Unprotected routes
router.get("/all", bookController.listAllBooks);
router.get("/:bookId", bookController.getBookById);

//Protected Routes User must be logged in to access it
router.post(
  "/create",
  [
    body("title", "Title is required").exists().trim(),
    body("author", "Author is required").exists().trim(),
    body("summary", "Summary is required").exists().trim(),
  ],
  isAuthenticated,
  bookController.createBook
);

router.put("/:bookId", isAuthenticated, bookController.updateBook);
router.delete("/:bookId", isAuthenticated, bookController.deleteBook);

module.exports = router;
