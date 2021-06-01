import express from "express";
import routes from "../routes";
import { postAddPhotoComment, postAddVideoComment, postDeletePhotoComment, postDeleteVideoComment, postRegiserPhotoView, postRegiserVideoView, postUpdatePhotoComment, postUpdateVideoComment } from "../controllers/boardController";
import { apiGetMe, apiLogout, apiPostJoin, apiPostLogin } from '../controllers/apiUserController';

const apiRouter = express.Router(); // 기존 Join과 비슷하지만 어플 API 서버이므로 url앞에 /api 추가

apiRouter.post(routes.apiJoin, apiPostJoin); 

apiRouter.post(routes.apiLogin, apiPostLogin);
        
apiRouter.get(routes.apiLogout, apiLogout);

apiRouter.get(routes.apiMe, apiGetMe);


// 프론트와 통신을 통해 댓글 및 조회수 기능 제공
apiRouter.post(routes.registerPhotoView, postRegiserPhotoView);  // 사진 및 비디오 조회수
apiRouter.post(routes.registerVideoView, postRegiserVideoView);

apiRouter.post(routes.addVideoComment, postAddVideoComment); // 비디오 댓글 추가, 수정, 삭제
apiRouter.post(routes.updateVideoComment(), postUpdateVideoComment);
apiRouter.post(routes.deleteVideoComment(), postDeleteVideoComment);

apiRouter.post(routes.addPhotoComment, postAddPhotoComment); // 사진 댓글 추가, 수정, 삭제
apiRouter.post(routes.updatePhotoComment(), postUpdatePhotoComment);
apiRouter.post(routes.deletePhotoComment(), postDeletePhotoComment);


export default apiRouter;