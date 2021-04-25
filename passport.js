import passport from "passport";
import User from "./models/User";

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser((user, done) => {
    return done(null, user);
}));


passport.deserializeUser((id, done) => {
    User.findOne({email: id}, (err, user) => {
        done(err, user);
    });
});