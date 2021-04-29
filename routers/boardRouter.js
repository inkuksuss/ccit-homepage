import express from 'express';
import { deletePhoto, deleteVideo, getEditPhoto, getEditVideo, getPhotoDetail, getPhotoUpload, getVideoDetail, getVideoUpload, photos, postEditPhoto, postEditVideo, postPhotoDetail, postPhotoUpload, postVideoDetail, postVideoUpload, videos } from '../controllers/boardController';
import { onlyPrivate, uploadPhoto, uploadVideo } from '../middleware';
import routes from '../routes';


const boardRouter = express.Router();

boardRouter.get(routes.photos, photos);

boardRouter
    .get(routes.photoUpload, onlyPrivate, getPhotoUpload)
    .post(routes.photoUpload, onlyPrivate, uploadPhoto, postPhotoUpload);

    
    boardRouter
    .get(routes.editPhoto(), onlyPrivate, getEditPhoto)
    .post(routes.editPhoto(), onlyPrivate, postEditPhoto);
    
    boardRouter.get(routes.deletePhoto(), onlyPrivate, deletePhoto);
    
    // Video
    boardRouter.get(routes.videos, videos);
    
    boardRouter
    .get(routes.videoUpload, onlyPrivate, getVideoUpload)
    .post(routes.videoUpload, onlyPrivate, uploadVideo, postVideoUpload);
    
boardRouter.get(routes.photoDetail(), getPhotoDetail);
boardRouter.post(routes.photoDetail(), postPhotoDetail);
boardRouter.get(routes.videoDetail(), getVideoDetail);
boardRouter.post(routes.videoDetail(), postVideoDetail);

boardRouter
    .get(routes.editVideo(), onlyPrivate, getEditVideo)
    .post(routes.editVideo(), onlyPrivate, postEditVideo);

boardRouter.get(routes.deleteVideo(), onlyPrivate, deleteVideo);

export default boardRouter;