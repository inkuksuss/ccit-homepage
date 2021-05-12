import multer from "multer";
import routes from './routes';
import User from './models/User';

const multerPhoto = multer({ dest: "uploads/boards/photo/" });
const multerVideo = multer({ dest: "uploads/boards/video/" });
const multerAvatar = multer({ dest: "uploads/boards/avatar/"});

export const localsMiddleware = (req, res , next) => {
    res.locals.siteName = "CCIT";
    res.locals.routes = routes;
    res.locals.loggedUser = req.user || null;
    next();
};

export const onlyPublic = (req, res, next) => {
  if(req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};

export const onlyPrivate = (req, res, next) => {
  if(req.user) {
    next();
  } else {
    res.redirect(routes.home);
  }
};

export const jwtOnlyPublic = async(req, res, next) => {
  if(!req.token || req.token === "") {
    next();  
  } else {
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