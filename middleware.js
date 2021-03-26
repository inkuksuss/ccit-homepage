import multer from "multer";
import routes from './routes';

const multerBoard = multer({ dest: "uploads/boards/" });

export const localsMiddleware = (req, res , next) => {
    res.locals.siteName = "CCIT";
    res.locals.routes = routes;
    res.setHeader("Content-Security-Policy", "script-src 'self' https://archive.org");
    res.locals.user = {
        isAuthenticated: true,
        id: 1
      };
    next();
};

export const uploadBoard = multerBoard.single("boardFile");