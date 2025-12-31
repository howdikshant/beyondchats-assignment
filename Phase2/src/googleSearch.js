import axios from "axios";

const SERP_API_KEY = process.env.SERPAPI_KEY;

export default async function googleSearch(title) {
  try {
    const res = await axios.get("https://serpapi.com/search", {
      params: {
        q: title,
        engine: "google",
        num: 5,
        api_key: SERP_API_KEY
      }
    });

    const results = res.data.organic_results || [];

    return results
      .filter(r => r.link && !r.link.includes("beyondchats.com"))
      .slice(0, 2)
      .map(r => ({
        title: r.title,
        link: r.link
      }));
  } catch (err) {
    console.error("Google search failed:", err.message);
    return [];
  }
}
