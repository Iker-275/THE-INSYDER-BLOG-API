const express = require("express");
const router = express.Router();
const {getAllArticles,postArticle, updateArticle, deleteArticle, searchArticles} = require("../controllers/blog_controller");


router.route("/articles").get(getAllArticles);
router.route("/articles/search").get(searchArticles);
router.post("/create",postArticle);
router.patch("/update/:id",updateArticle);
router.delete("/delete/:id",deleteArticle);








module.exports = router;
