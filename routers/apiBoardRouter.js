import express from 'express';
import { apiDeletePhoto, apiDeleteVideo, apiGetEditPhoto, apiGetEditVideo, apiGetPhotoDetail, apiGetVideoDetail, apiPhotos, apiPostEditPhoto, apiPostEditVideo, apiPostPhotoDetail, apiPostPhotoUpload, apiPostVideoDetail, apiVideos } from '../controllers/apiBoardController';
import { jwtOnlyPrivate, uploadPhoto, uploadVideo } from '../middleware';
import routes from '../routes';


const apiBoardRouter = express.Router();

apiBoardRouter.get(routes.photos, apiPhotos);

apiBoardRouter.post(routes.photoUpload, jwtOnlyPrivate, uploadPhoto, apiPostPhotoUpload);

    
apiBoardRouter
    .get(routes.apiEditPhoto(), jwtOnlyPrivate, apiGetEditPhoto)
    .post(routes.apieditPhoto(), jwtOnlyPrivate, apiPostEditPhoto);

apiBoardRouter.get(routes.apiDeletePhoto(), jwtOnlyPrivate, apiDeletePhoto);

// Video
apiBoardRouter.get(routes.apiVideos, apiVideos);

apiBoardRouter
    .get(routes.apiVideoUpload, jwtOnlyPrivate, apiGetEditVideo)
    .post(routes.apiVideoUpload, jwtOnlyPrivate, uploadVideo, apiPostEditPhoto);
    
apiBoardRouter
    .get(routes.apiPhotoDetail(), apiGetPhotoDetail)
    .post(routes.apiPhotoDetail(), apiPostPhotoDetail);

apiBoardRouter
    .get(routes.apiVideoDetail(), apiGetVideoDetail)
    .post(routes.apiVideoDetail(), apiPostVideoDetail);

apiBoardRouter
    .get(routes.apiEditVideo(), jwtOnlyPrivate, apiGetEditVideo)
    .post(routes.apiEditVideo(), jwtOnlyPrivate, apiPostEditVideo);

apiBoardRouter.get(routes.apiDeleteVideo(), jwtOnlyPrivate, apiDeleteVideo);

export default apiBoardRouter;