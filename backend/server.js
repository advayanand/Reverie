import express from 'express';
import cors from 'cors';
import routes from './api/routes.js'

const app = express();

app.use(
    cors({
        origin: '*',
        credentials: true
    })
);
// app.use(cors());
// app.options('*', cors());
app.use(express.json());


app.use('/api/v1', routes);
app.use('*', (req, res) => res.status(404).json({ error: "not found" }));

export default app;