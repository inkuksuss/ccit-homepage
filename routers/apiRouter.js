import express from "express";
import routes from "../routes";
import { postAddPhotoComment, postAddVideoComment, postDeletePhotoComment, postDeleteVideoComment, postRegiserPhotoView, postRegiserVideoView, postUpdatePhotoComment, postUpdateVideoComment } from "../controllers/boardController";

const apiRouter = express.Router();

apiRouter.post(routes.registerPhotoView, postRegiserPhotoView);
apiRouter.post(routes.registerVideoView, postRegiserVideoView);

apiRouter.post(routes.addVideoComment, postAddVideoComment);
apiRouter.post(routes.updateVideoComment(), postUpdateVideoComment);
apiRouter.post(routes.deleteVideoComment(), postDeleteVideoComment);

apiRouter.post(routes.addPhotoComment, postAddPhotoComment);
apiRouter.post(routes.updatePhotoComment(), postUpdatePhotoComment);
apiRouter.post(routes.deletePhotoComment(), postDeletePhotoComment);


export default apiRouter;