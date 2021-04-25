import dotenv from 'dotenv';
import "./db";
import app from './app';
import "./models/Comment";
import "./models/User";
import "./models/Video";
import "./models/Photo";


dotenv.config();

const PORT = process.env.PORT || 4000;

const handleListing = () =>
    console.log(`😈Listening on: http://localhost:${PORT}`);

app.listen(PORT, handleListing);