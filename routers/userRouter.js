import express from 'express';
import { userDetail, getEditProfile, postEditProfile, getChangePassword, postChangePassword, userMqtt } from '../controllers/userController';
import { onlyPrivate, uploadAvatar } from '../middleware';
import routes from '../routes';

const userRouter = express.Router();

userRouter
    .get(routes.editProfile, onlyPrivate, getEditProfile) 
    .post(routes.editProfile, onlyPrivate, uploadAvatar, postEditProfile);

userRouter
    .get(routes.changePassword, onlyPrivate, getChangePassword)  
    .post(routes.changePassword, onlyPrivate, postChangePassword);

userRouter.get(routes.userDetail(), userDetail);

userRouter.get(routes.mqtt(), onlyPrivate, userMqtt);

export default userRouter;

