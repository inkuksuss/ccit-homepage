import express from "express";
import routes from "../routes";
import { postAddPhotoComment, postAddVideoComment, postDeletePhotoComment, postDeleteVideoComment, postRegiserView, postUpdatePhotoComment, postUpdateVideoComment } from "../controllers/boardController";

const apiRouter = express.Router();

apiRouter.post(routes.registerView, postRegiserView);

apiRouter.post(routes.addVideoComment, postAddVideoComment);
apiRouter.post(routes.updateVideoComment(), postUpdateVideoComment);
apiRouter.post(routes.deleteVideoComment(), postDeleteVideoComment);

apiRouter.post(routes.addPhotoComment, postAddPhotoComment);
apiRouter.post(routes.updatePhotoComment(), postUpdatePhotoComment);
apiRouter.post(routes.deletePhotoComment(), postDeletePhotoComment);


export default apiRouter;