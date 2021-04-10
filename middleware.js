import multer from "multer";
import routes from './routes';

const multerBoard = multer({ dest: "uploads/boards/" });
const multerAvatar = multer({ dest: "uploads/boards/"});

export const localsMiddleware = (req, res , next) => {
    res.locals.siteName = "CCIT";
    res.locals.routes = routes;
    // res.setHeader("Content-Security-Policy", "script-src 'self' https://archive.org");
    res.locals.loggedUser = req.body.user || req.user || null;
    // console.log(res.locals.loggedUser);
    next();
};

export const onlyPublic = (req, res, next) => {
  if(req.user || req.body.user) {
    console.log(req.user);
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

export const uploadBoard = multerBoard.single("boardFile");
export const uploadAvatar = multerAvatar.single("avatar")