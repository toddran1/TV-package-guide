import express from 'express';
import cors from "cors";
import * as middlewares from './middlewares';
import api from './api';
import {initializeDatabase} from "./data/database";

require('dotenv').config();

initializeDatabase()

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
