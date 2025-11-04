const express = require("express");
const router = express.Router();
const {getAllArticles,postArticle, updateArticle, deleteArticle} = require("../controllers/blog_controller");


router.route("/articles").get(getAllArticles);
router.post("/create",postArticle);
router.patch("/update/:id",updateArticle);
router.delete("/delete/:id",deleteArticle);








module.exports = router;
