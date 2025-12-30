const express = require("express");
const router = express.Router();
const controller = require("../controllers/articleController");

router.get("/", controller.getAllArticles);
router.get("/:id", controller.getArticleById);
router.post("/", controller.createArticle);
router.put("/:id", controller.updateArticle);
router.delete("/:id", controller.deleteArticle);

module.exports = router;
