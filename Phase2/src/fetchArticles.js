import axios from "axios";

const PHASE1_API_BASE = process.env.PHASE1_API_BASE;

export default async function fetchArticles() {
  try {
    const res = await axios.get(PHASE1_API_BASE);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch articles:", err.message);
    return [];
  }
}
