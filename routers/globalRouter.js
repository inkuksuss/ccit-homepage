import express from "express";
import { postDeleteVideo, postDeletePhoto } from '../controllers/adminController';
import { home, search } from '../controllers/boardController';
import { getJoin, postJoin, logout, getLogin, postLogin, getMe } from '../controllers/userController';
import { onlyPrivate, onlyPublic } from '../middleware';
import routes from "../routes";


const globalRouter = express.Router();

globalRouter
    .get(routes.join, onlyPublic, getJoin)
    .post(routes.join, onlyPublic, postJoin, postLogin); 
    // post 방식으로 routes.join 요청이 오면 onlyPublic 미들웨어 통과시 postJoin -> postLogin 순으로 실행 

globalRouter 
    .post(routes.login, onlyPublic, postLogin)
    .get(routes.login, onlyPublic, getLogin);
        
globalRouter
    .get(routes.logout, onlyPrivate, logout)

globalRouter
    .get(routes.home, home)

globalRouter.get(routes.me, getMe);

globalRouter.get(routes.search, search);

globalRouter.post(routes.adminDeleteVideo(), postDeleteVideo);
globalRouter.post(routes.adminDeletePhoto(), postDeletePhoto);

export default globalRouter;