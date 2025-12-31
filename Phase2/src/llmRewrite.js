import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function rewriteArticle({
  originalTitle,
  originalContent,
  referenceArticles
}) {
  const referencesText = referenceArticles
    .map((r, i) => `Reference ${i + 1}:\n${r.content}`)
    .join("\n\n");

  const prompt = `
You are a professional content writer.

TASK:
Rewrite the ORIGINAL ARTICLE using insights, structure, and tone from the REFERENCE ARTICLES.

RULES:
- DO NOT copy sentences
- DO NOT mention competitors by name inside content
- Improve clarity, structure, and depth
- Keep SEO-friendly headings
- Keep article length similar or better
- End with a References section listing the source URLs

ORIGINAL ARTICLE:
Title: ${originalTitle}
Content:
${originalContent}

REFERENCE ARTICLES:
${referencesText}

OUTPUT FORMAT:
- Title
- Well-structured article (headings + paragraphs)
- References (bullet list with URLs)
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You rewrite blog articles professionally." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7
  });

  return response.choices[0].message.content;
}
