import express from "express";
import routes from "../routes";
import { postAddComment, postRegiserView } from "../controllers/boardController";

const apiRouter = express.Router();

apiRouter.post(routes.registerView, postRegiserView);
apiRouter.post(routes.addComment, postAddComment);

export default apiRouter;