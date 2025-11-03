const express = require("express");
const router = express.Router();
const {getAllArticles,postArticle, updateArticle} = require("../controllers/blog_controller");


router.route("/articles").get(getAllArticles);
router.post("/create",postArticle);
router.patch("/update/:id",updateArticle);








module.exports = router;
