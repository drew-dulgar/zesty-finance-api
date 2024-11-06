import cors from 'cors';
import { APP_ORIGIN_URL } from "../../config/env.js";

const corsMiddleware = cors({
  origin: APP_ORIGIN_URL,
  methods: ['POST', 'PUT', 'PATCH', 'GET', 'DELETE', 'OPTIONS', 'HEAD'],
  credentials: true
});

export default corsMiddleware;