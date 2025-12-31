const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    publishedAt: String,

    // Extend the Article schema to support full content storage
    // Add fields: originalContent, updatedContent, references
    // Enable timestamps for createdAt and updatedAt
    originalContent: String,
    updatedContent: String,

    sourceUrl: {
      type: String
    },
    

    version: {
      type: String,
      enum: ["original", "updated"],
      default: "original",
    },

    references: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
