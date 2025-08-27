import axios from 'axios';
import { NewsArticle } from "./types";

const NEWS_API_BASE_URL =
  process.env.NEXT_PUBLIC_NEWS_API_URL || "http://localhost:8083";

const newsApiClient = axios.create({
  baseURL: NEWS_API_BASE_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  }
});

export class NewsApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = NEWS_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getRecentNewsForDashboard(): Promise<NewsArticle[]> {
    try {
      const response = await newsApiClient.get<NewsArticle[]>('/api/news/recent');
      return response.data.slice(0, 3);
    } catch (error) {
      console.error("Error fetching recent news:", error);
      return [];
    }
  }
  async getAllNews(): Promise<NewsArticle[]> {
    try {
      const response = await newsApiClient.get<NewsArticle[]>('/api/news');
      return response.data;
    } catch (error) {
      console.error("Error fetching all news:", error);
      return [];
    }
  }
}

export const newsApi = new NewsApiClient();