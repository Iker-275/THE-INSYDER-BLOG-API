const express = require("express");
const router = express.Router();
const {getAllArticles} = require("../controllers/blog_controller");


router.route("/articles").get(getAllArticles);








module.exports = router;
