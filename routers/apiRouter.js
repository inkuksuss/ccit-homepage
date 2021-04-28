import express from "express";
import routes from "../routes";
import { postAddVideoComment, postDeleteVideoComment, postRegiserView, postUpdateVideoComment } from "../controllers/boardController";

const apiRouter = express.Router();

apiRouter.post(routes.registerView, postRegiserView);
apiRouter.post(routes.addVideoComment, postAddVideoComment);
apiRouter.post(routes.updateVideoComment(), postUpdateVideoComment);
apiRouter.post(routes.deleteVideoComment(), postDeleteVideoComment);

export default apiRouter;