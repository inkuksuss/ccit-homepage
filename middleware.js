import multer from "multer";
import routes from './routes';

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
}

export const uploadPhoto = multerPhoto.single("photoFile");
export const uploadVideo = multerVideo.single("videoFile");
export const uploadAvatar = multerAvatar.single("avatar")