import axios from "axios";

const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:8000" : "https://lb.ltng.link/flightbook";

export default axios.create({
  baseURL: baseUrl
});
