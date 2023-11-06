const { isValidObjectId } = require("mongoose");

const { validationResult } = require("express-validator");
const Book = require("../models/Book");

exports.createBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const { title, author, summary } = req.body;
    const { userId } = req;
    if (!title || !author || !summary) {
      const err = new Error("Invalid Parameters");
      err.statusCode = 422;
      throw err;
    }

    const newBook = new Book({ title, author, summary, creator: userId });
    await newBook.save();
    return res
      .status(201)
      .send({ data: newBook, message: "Book Created Successfully." });
  } catch (err) {
    next(err);
  }
};
exports.updateBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const { title, author, summary } = req.body;
    const { bookId } = req.params;
    if (!title || !author || !summary) {
      const err = new Error("Invalid Parameters");
      err.statusCode = 422;
      throw err;
    }
    const book = await Book.findById(bookId);
    if (!book) {
      const err = new Error("Book Not Found");
      err.statusCode = 404;
      throw err;
    }
    if (book.creator.toString() !== req.userId) {
      const error = new Error("Not authorized.");
      error.statusCode = 403;
      throw error;
    }
    book.title = title;
    book.author = author;
    book.summary = summary;
    await book.save();
    return res.status(201).send({ data: book, status: "Success" });
  } catch (err) {
    next(err);
  }
};

exports.listAllBooks = async (req, res, next) => {
  try {
    const currentPage = +req.query.page || 1;
    const perPage = +req.query.pageSize || 10;
    const totalBooks = await Book.find().countDocuments();
    const bookLists = await Book.find()
      .populate("creator", "name")
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    return res.status(200).json({
      message: "Posts fetched successfully",
      data: { bookLists, totalBooks, bookPerPage: perPage, currentPage },
    });
  } catch (err) {
    next(err);
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    if (!isValidObjectId(bookId)) {
      const err = new Error("Invalid Id");
      err.statusCode = 422;
      throw err;
    }
    const book = await Book.findById(bookId);
    res.status(200).json({ messge: "book Fetched successfully", data: book });
  } catch (err) {
    next(err);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    if (!isValidObjectId(bookId)) {
      const err = new Error("Invalid Id");
      err.statusCode = 422;
      throw err;
    }
    const book = await Book.findById(bookId);
    if (!book) {
      const err = new Error("book not found");
      err.statusCode = 404;
      throw err;
    }
    if (book.creator.toString() !== req.userId) {
      const error = new Error("Not authorized.");
      error.statusCode = 403;
      throw error;
    }
    await Book.findByIdAndDelete(bookId);
    res.status(200).json({ messge: "book deleted successfully" });
  } catch (err) {
    next(err);
  }
};
