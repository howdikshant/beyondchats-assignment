const Article = require("../models/Article");

// Save scraped articles into MongoDB
// Use updateOne with upsert:true to prevent duplicates
// Match articles uniquely using sourceUrl
// Store title, sourceUrl, and originalContent fields
async function saveToDB(blogs) {
  let saved = 0;
  let updated = 0;

  for (const blog of blogs) {
    const filter = { sourceUrl: blog.link };
    const update = {
      $set: {
        title: blog.title,
        sourceUrl: blog.link,
        originalContent: blog.originalContent || "",
      },
    };

    const res = await Article.updateOne(filter, update, { upsert: true });

    // upsertedCount is driver-specific; check result to infer action
    if (res.upsertedCount || res.upsertedId) {
      saved++;
    } else if (res.modifiedCount) {
      updated++;
    }

    const len = blog.originalContent ? blog.originalContent.length : 0;
    if (len === 0) {
      console.warn(`Original content empty for ${blog.link}`);
    } else if (len < 1000) {
      console.warn(`Original content unusually short (${len}) for ${blog.link}`);
    } else {
      console.log(`Saved/Updated: ${blog.link} (content length: ${len})`);
    }
  }

  console.log(`New: ${saved}, Updated: ${updated}`);
}

module.exports = saveToDB;
