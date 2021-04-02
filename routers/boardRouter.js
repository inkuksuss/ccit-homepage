import express from 'express';
import { boardDetail, boards, deleteBoard, getUpload, getEditBoard, postEditBoard, postUpload } from '../controllers/boardController';
import { onlyPrivate, uploadBoard } from '../middleware';
import routes from '../routes';


const boardRouter = express.Router();

// Board
boardRouter.get(routes.boards, boards);

// Upload
boardRouter
    .get(routes.upload, onlyPrivate, getUpload)
    .post(routes.upload, onlyPrivate, uploadBoard, postUpload);

// Board Detail
boardRouter.get(routes.boardDetail(), boardDetail);

// Edit Board
boardRouter
    .get(routes.editBoard(), onlyPrivate, getEditBoard)
    .post(routes.editBoard(), onlyPrivate, postEditBoard);

// Delete Board
boardRouter.get(routes.deleteBoard(), onlyPrivate, deleteBoard);

export default boardRouter;