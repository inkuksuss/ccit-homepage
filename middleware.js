import multer from "multer";
import routes from './routes';
import User from './models/User';

const multerPhoto = multer({ dest: "uploads/boards/photo/" });
const multerVideo = multer({ dest: "uploads/boards/video/" });
const multerAvatar = multer({ dest: "uploads/boards/avatar/"});

export const localsMiddleware = (req, res , next) => {
    res.locals.siteName = "CCIT"; // siteName, routes, loggedUser 전역변수 만들기
    res.locals.routes = routes; 
    res.locals.loggedUser = req.user || null;
    next();
};

export const onlyPublic = (req, res, next) => {
  if(req.user) { // req.user가 있다면 홈으로 이동
    res.redirect(routes.home);
  } else { // 없으면 통과
    next();
  }
};

export const onlyPrivate = (req, res, next) => {
  if(req.user) { // req.user가 있다면 통과
    next();
  } else { // 없다면 홈으로
    res.redirect(routes.home);
  }
};

export const jwtOnlyPublic = async(req, res, next) => {
  if(!req.token || req.token === "") { // req.toekn이 없다면 통과
    next();  
  } else { // 있다면 비인가
    res.status(401).end();
  }
};

export const jwtOnlyPrivate = async(req, res, next) => {
  if(!req.token || req.token === "") {
    res.status(401).end();
  } else {
    const user = await User.findOne({ token: req.token });
    req.user = user;
    next();
  }
};

export const uploadPhoto = multerPhoto.single("photoFile");
export const uploadVideo = multerVideo.single("videoFile");
export const uploadAvatar = multerAvatar.single("avatar")