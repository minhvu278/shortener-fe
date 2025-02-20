import axios from "axios";

const API_BASE_URL = 'http://103.221.221.110:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})