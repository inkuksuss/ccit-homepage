import "./db";
import app from './app';
import dotenv from 'dotenv';
import "./models/Board";
import "./models/Comment";
dotenv.config();

const PORT = process.env.PORT || 4000;

const handleListing = (req,res) =>
    console.log(`😈Listening on: http://localhost:${PORT}`);

app.listen(PORT, handleListing);