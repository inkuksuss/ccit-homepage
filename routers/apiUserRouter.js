import express from 'express';
import { userDetail, getEditProfile, postEditProfile, getChangePassword, postChangePassword, userMqtt } from '../controllers/userController';
import { jwtOnlyPrivate, uploadAvatar } from '../middleware';
import routes from '../routes';

const apiUserRouter = express.Router();

apiUserRouter
    .get(routes.editProfile, jwtOnlyPrivate, getEditProfile)
    .post(routes.editProfile, jwtOnlyPrivate, uploadAvatar, postEditProfile);

apiUserRouter
    .get(routes.changePassword, jwtOnlyPrivate, getChangePassword)  
    .post(routes.changePassword, jwtOnlyPrivate, postChangePassword);

apiUserRouter.get(routes.userDetail(), userDetail);

apiUserRouter.get(routes.mqtt(), jwtOnlyPrivate, userMqtt);

export default apiUserRouter;

