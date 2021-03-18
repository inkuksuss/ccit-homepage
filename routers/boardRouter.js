import express from 'express';
import { boardDetail, boards, deleteBoard, editBoard, upload } from '../controllers/boardController';
import routes from '../routes';

const boardRouter = express.Router();

boardRouter.get(routes.boards, boards);
boardRouter.get(routes.upload, upload);
boardRouter.get(routes.boardDetail, boardDetail);
boardRouter.get(routes.editBoard, editBoard);
boardRouter.get(routes.deleteBoard, deleteBoard);

export default boardRouter;