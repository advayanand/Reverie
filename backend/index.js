import app from "./server.js";
import mongodb from 'mongodb';
import dotenv from "dotenv";
import UsersDAO from './dao/UsersDAO.js'
import PostsDAO from "./dao/PostsDAO.js";
import CommentsDAO from "./dao/CommentsDAO.js";
import VotesDAO from "./dao/VotesDAO.js";

dotenv.config();

const MongoClient = mongodb.MongoClient;
const url = process.env.DREAMWORLD_DB_URL;
const port = process.env.PORT || 8000;

MongoClient.connect(
    url,
    {
        // poolSize: 50,
        wtimeoutMS: 2500,
        // useNewUrlParse: true,
    }
)
.catch(err => {
    console.error(err.stack);
    process.exit(1);
})
.then(async client => {
    await UsersDAO.injectDB(client);
    await PostsDAO.injectDB(client);
    await CommentsDAO.injectDB(client);
    await VotesDAO.injectDB(client);
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
});