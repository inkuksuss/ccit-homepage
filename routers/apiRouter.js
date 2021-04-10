import express from "express";
import routes from "../routes";
import { postAddComment, postRegiserView } from "../controllers/boardController";
import { postKakaoLogin } from '../controllers/userController';

const apiRouter = express.Router();

apiRouter.post(routes.registerView, postRegiserView);
apiRouter.post(routes.addComment, postAddComment);
apiRouter.post(routes.kakaoLogin, postKakaoLogin);

export default apiRouter;