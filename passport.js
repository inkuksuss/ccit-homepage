import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import { googleLoginCallback } from './controllers/userController';
import User from "./models/User";
import routes from './routes';

passport.use(User.createStrategy());

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `http://localhost:4000${routes.googleCallback}`,
        passReqToCallback: true
    },
    googleLoginCallback
));

passport.serializeUser(User.serializeUser((user, done) => {
    return done(null, user);
}));


passport.deserializeUser((id, done) => {
    User.findOne({email: id}, (err, user) => {
        done(err, user);
    });
});