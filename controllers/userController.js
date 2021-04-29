/* eslint-disable object-shorthand */
import passport from "passport";
import routes from "../routes";
import User from "../models/User";

// Global
export const getJoin = (req, res) => {
    res.render("join", { pageTitle: "Join" });
};
  
export const postJoin = async (req, res, next) => {
    const {
        body: { name, email, password, password2 }
    } = req;
    const checkEmail = await User.findOne({ email })
    if (password !== password2) {
        req.flash("error",  '비밀번호가 일치하지 않습니다.');
        res.status(400);
        res.render("join", { pageTitle: "Join" });
    } else if(checkEmail){
        res.status(400);
        res.render("join", { pageTitle: "Join" });
    } else {
        try {
            const user = await User({
                name,
                email,
                avatar: "basicimg"
            });
            await User.register(user, password);
            next();
        } catch(err) {
            console.log(err);
            res.redirect(routes.home);
        }
    }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log In" });

export const postLogin = passport.authenticate("local", {
    failureRedirect: routes.login,
    successRedirect: routes.home,
    successFlash: '환영합니다.',
    failureFlash: '아이디나 비밀번호를 확인해주세요.'

});

export const logout = (req, res) => {
    req.flash('info', '로그아웃 완료');
    req.logout();
    res.redirect(routes.login);
    // req.session.destroy(() => {
    //     res.clearCookie('connect.sid');
    // }); 
};

export const getMe =  async (req, res) => {
    const { 
        user: { id }
    } = req;
    console.log(id);
    try {
        const user = await User.findById(id).populate('videos').populate('photos');
        res.render("userDetail", { pageTitle: "User Detail", user });
    } catch(err) {
        res.redirect(routes.home);
    }
};

// Users
export const userDetail = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const user = await User.findById(id).populate('videos').populate('photos');
        res.render("userDetail", { pageTitle: "User Detail", user });
    } catch (error) {
        req.flash('error', '유저가 존재하지 않습니다.');
        res.redirect(routes.home);
    }
};

export const getEditProfile = (req, res) => {
     res.render("editProfile", { pageTitle: "Edit Profile" })};

export const postEditProfile = async (req, res) => {
    const {
         body: {    
            name,
            email
         },
         file
    } = req;    /////////////////////////////// req.user로 하면 에러뜸 why?
    try {
        await User.findByIdAndUpdate({_id: req.user._id}, {$set: {  
            name,
            email,
            avatar: (file ? file.path : req.user.avatar)
        }}, {new: true});
        req.flash('success', '프로필 수정 완료');
        res.redirect(routes.me);
    } catch (err) {
        req.flash('error', '프로필 수정 실패');
        res.redirect(routes.editProfile);
    }
};

export const getChangePassword = (req,res) => {
     res.render("changePassword", { pageTitle: "Change Paasword" })};

export const postChangePassword =  async (req,res) => {
    const { body:
            {
                oldPassword,
                newPassword,
                newPassword1
            }
        } = req;
    try {
        if(newPassword !== newPassword1) {
            req.flash('error', '비밀번호가 일치하지 않습니다.');
            res.status(400);
            res.redirect(`/users${routes.changePassword}`);
            return;
        }
        req.flash('error', '비밀번호 변경 완료');
        await req.user.changePassword(oldPassword, newPassword1);
        res.redirect(routes.me);
    } catch(err) {
        req.flash('error', '비밀번호 변경 실패');
        res.status(400);
        res.redirect(`/users${routes.changePassword}`);
    }
};

export const userMqtt = (req, res) => {
    res.render("socket", { pageTitle: "Socket"})};