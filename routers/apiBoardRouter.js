import express from 'express';
import { deletePhoto, deleteVideo, getEditPhoto, getEditVideo, getPhotoDetail, getPhotoUpload, getVideoDetail, getVideoUpload, photos, postEditPhoto, postEditVideo, postPhotoDetail, postPhotoUpload, postVideoDetail, postVideoUpload, videos } from '../controllers/boardController';
import { onlyPrivate, uploadPhoto, uploadVideo } from '../middleware';
import routes from '../routes';


const apiBoardRouter = express.Router();

apiBoardRouter.get(routes.photos, photos);

apiBoardRouter
    .get(routes.photoUpload, onlyPrivate, getPhotoUpload)
    .post(routes.photoUpload, onlyPrivate, uploadPhoto, postPhotoUpload);

    
apiBoardRouter
    .get(routes.editPhoto(), onlyPrivate, getEditPhoto)
    .post(routes.editPhoto(), onlyPrivate, postEditPhoto);

apiBoardRouter.get(routes.deletePhoto(), onlyPrivate, deletePhoto);

// Video
apiBoardRouter.get(routes.videos, videos);

apiBoardRouter
    .get(routes.videoUpload, onlyPrivate, getVideoUpload)
    .post(routes.videoUpload, onlyPrivate, uploadVideo, postVideoUpload);
    
apiBoardRouter.get(routes.photoDetail(), getPhotoDetail);
apiBoardRouter.post(routes.photoDetail(), postPhotoDetail);
apiBoardRouter.get(routes.videoDetail(), getVideoDetail);
apiBoardRouter.post(routes.videoDetail(), postVideoDetail);

apiBoardRouter
    .get(routes.editVideo(), onlyPrivate, getEditVideo)
    .post(routes.editVideo(), onlyPrivate, postEditVideo);

apiBoardRouter.get(routes.deleteVideo(), onlyPrivate, deleteVideo);

export default apiBoardRouter;