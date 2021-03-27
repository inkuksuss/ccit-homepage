import express from 'express';
import { boardDetail, boards, deleteBoard, getUpload, getEditBoard, postEditBoard, postUpload } from '../controllers/boardController';
import { uploadBoard } from '../middleware';
import routes from '../routes';


const boardRouter = express.Router();

// Board
boardRouter.get(routes.boards, boards);

// Upload
boardRouter
    .get(routes.upload, getUpload)
    .post(routes.upload, uploadBoard, postUpload);

// Board Detail
boardRouter.get(routes.boardDetail(), boardDetail);

// Edit Board
boardRouter
    .get(routes.editBoard(), getEditBoard)
    .post(routes.editBoard(), postEditBoard);

// Delete Board
boardRouter.get(routes.deleteBoard(), deleteBoard);

export default boardRouter;