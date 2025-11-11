const express = require("express");
const router = express.Router();
const {getAllArticles,postArticle, updateArticle, deleteArticle, searchArticles} = require("../controllers/blogController");
const { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor } = require("../controllers/authorController");
const{ getAllGenres, getGenreById, createGenre, updateGenre, deleteGenre } = require("../controllers/genreController");
const { loginGet, signupGet, loginPost, signupPost } = require("../controllers/authController");

//articles
router.route("/articles").get(getAllArticles);
router.route("/articles/search").get(searchArticles);
router.post("/articles/create",postArticle);
router.patch("/articles/update/:id",updateArticle);
router.delete("/articles/delete/:id",deleteArticle);

//authors
router.route("/authors").get(getAllAuthors);
router.route("/authors/:id").get(getAuthorById);
router.post("/authors/create",createAuthor);
router.patch("/authors/update/:id",updateAuthor);
router.delete("/authors/delete/:id",deleteAuthor);


//genres
router.route("/genres").get(getAllGenres);
router.route("/genres/:id").get(getGenreById);
router.post("/genres/create",createGenre);
router.patch("/genres/update/:id",updateGenre);
router.delete("/genres/delete/:id",deleteGenre);

//auth
router.route("/login").get(loginGet);
router.route("/signup").get(signupGet);
router.post("/login",loginPost);
router.post("/signup",signupPost);









module.exports = router;
