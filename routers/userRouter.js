import express from 'express';
import { changePassword, userDetail, cart, getEditProfile, postEditProfile } from '../controllers/userController';
import { onlyPrivate, uploadAvatar } from '../middleware';
import routes from '../routes';

const userRouter = express.Router();

userRouter
    .get(routes.editProfile, onlyPrivate, getEditProfile)
    .post(routes.editProfile, onlyPrivate, uploadAvatar, postEditProfile);

userRouter.get(routes.changePassword, onlyPrivate, changePassword);
userRouter.get(routes.userDetail(), onlyPrivate, userDetail);
userRouter.get(routes.cart, cart);


export default userRouter;

