import express from 'express';
import { apiDeletePhoto, apiDeleteVideo, apiGetEditPhoto, apiGetEditVideo, apiGetPhotoDetail, apiGetVideoDetail, apiPhotos, apiPostEditPhoto, apiPostEditVideo, apiPostPhotoDetail, apiPostPhotoUpload, apiPostVideoDetail, apiVideos, getPhotoComplainPopup, getVideoComplainPopup, postPhotoComplain, postPhotoComplainPopup, postVideoComplain, postVideoComplainPopup } from '../controllers/apiBoardController';
import { jwtOnlyPrivate, uploadPhoto, uploadVideo } from '../middleware';
import routes from '../routes';


const apiBoardRouter = express.Router();

apiBoardRouter.get(routes.photos, apiPhotos);

apiBoardRouter.post(routes.photoUpload, jwtOnlyPrivate, uploadPhoto, apiPostPhotoUpload);

    
apiBoardRouter
    .get(routes.apiEditPhoto(), jwtOnlyPrivate, apiGetEditPhoto)
    .post(routes.apiEditPhoto(), jwtOnlyPrivate, apiPostEditPhoto);

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

apiBoardRouter.post(routes.videoComplain(), postVideoComplain);
apiBoardRouter.get(routes.videoComplainPopup(), getVideoComplainPopup);
apiBoardRouter.post(routes.videoComplainPopup(), postVideoComplainPopup);

apiBoardRouter.post(routes.photoComplain(), postPhotoComplain);
apiBoardRouter.get(routes.photoComplainPopup(), getPhotoComplainPopup);
apiBoardRouter.post(routes.photoComplainPopup(), postPhotoComplainPopup);

export default apiBoardRouter;