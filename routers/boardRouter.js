import express from 'express';
import { boardDetail, boards, deleteBoard, editBoard, getUpload, postUpload } from '../controllers/boardController';
import { uploadBoard } from '../middleware';
import routes from '../routes';


const boardRouter = express.Router();

boardRouter.get(routes.boards, boards);

boardRouter
    .get(routes.upload, getUpload)
    .post(routes.upload, uploadBoard, postUpload);

boardRouter.get(routes.boardDetail(), boardDetail);
boardRouter.get(routes.editBoard, editBoard);
boardRouter.get(routes.deleteBoard, deleteBoard);

export default boardRouter;