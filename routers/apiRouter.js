import express from "express";
import routes from "../routes";
import { postAddVideoComment, postDeleteVideoComment, postRegiserView } from "../controllers/boardController";

const apiRouter = express.Router();

apiRouter.post(routes.registerView, postRegiserView);
apiRouter.post(routes.addVideoComment, postAddVideoComment);
apiRouter.post(routes.deleteVideoComment(), postDeleteVideoComment);

export default apiRouter;