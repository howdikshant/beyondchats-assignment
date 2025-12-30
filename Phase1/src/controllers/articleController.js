const Article = require("../models/Article");

exports.getAllArticles = async (req, res) => {
  const articles = await Article.find();
  res.json(articles);
};

exports.getArticleById = async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.json(article);
};

exports.createArticle = async (req, res) => {
  const article = await Article.create(req.body);
  res.status(201).json(article);
};

exports.updateArticle = async (req, res) => {
  const article = await Article.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(article);
};

exports.deleteArticle = async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ message: "Article deleted" });
};
