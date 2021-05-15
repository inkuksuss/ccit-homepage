/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable object-shorthand */
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/User";

// Global
export const apiPostJoin = async (req, res, next) => {
    const {
        body: { name, email, password, password2 }
    } = req;
    try {
        const checkEmail = await User.findOne({ email })
        if (password !== password2) {
            res.json({
                success: false,
                message: "비밀번호 확인이 일치하지 않습니다."
            })
        } else if(checkEmail){
            res.json({
                success: false,
                message: "이미 가입된 이메일입니다."
            })
        } else {
            const user = await User({
                name,
                email,
                avatar: "basicimg",
                token: ""
            });
            await User.register(user, password);
            res.json({
                success: true,
                message: "회원가입 성공"
            })
            next();
        }
    } catch(err) {
        res.json({
            success: false,
            message: "에러 발생"
        })
    }
};

export const apiPostLogin = async (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user) => {
        if(err) { return res.json({
            success: false,
            message: "에러 발생"
        })}
        if(!user) { return res.json({
            success: false,
            message: "가입된 유저가 아닙니다."
        })}
        req.logIn(user, { session: false }, err => {
            if(err) { return res.json({
                success: false,
                message: "에러 발생"
            })}
            const token = jwt.sign(
                { _id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            user.token = token;
            user.save();
            console.log(user);
            return res.json({
                success: true,
                message: "로그인 성공",
                token
            });
        })
    })(req, res, next)
};

export const apiLogout = async (req, res) => {
    const {
        user: { _id: id }
    } = req;
    try { 
        const user = await User.findByIdAndUpdate(id, { token: "" });
        user.save()
        res.json({
            token: "",
            logout: true,
            message: "로그아웃 성공"
        })
    } catch(err) {
        res.json({
            logout: false,
            message: "로그아웃 실패"
        })
    }
};

export const apiGetMe =  async (req, res) => {
    const { 
        user: { _id: id }
    } = req;
    try {
        const user = await User.findById(id).populate('videos').populate('photos');
        res.json({
            success: true,
            data: user
        });
    } catch(err) {
        res.json({
            success: false,
            data: null
        });
    }
};

// Users
export const apiUserDetail = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const user = await User.findById(id).populate('videos').populate('photos');
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.json({
            success: false,
            data: null
        });
    }
};

export const apiPostEditProfile = async (req, res) => {
    const {
         body: {    
            name,
            email
         },
         user: { id },
         file
    } = req; 
    try {
        await User.findByIdAndUpdate(id, {       
            name,
            email,
            avatar: (file ? file.path : req.user.avatar)
        }, {new: true});
        res.json({
            success: true
        });
    } catch (err) {
        req.json({
            success: false
        });
    }
};

export const apiPostChangePassword =  async (req,res) => {
    const { body:
            {
                oldPassword,
                newPassword,
                newPassword2
            }
        } = req;
    try {
        if(newPassword !== newPassword2) {
            return res.json({
                success: false,
                message: "비밀번호 확인이 일치하지 않습니다."
            });
        }
        await req.user.changePassword(oldPassword, newPassword2);
        res.json({
            success: true,
            message: "비밀번호 변경 성공했습니다."
        })
    } catch(err) {
        res.json({
            success: false,
            err
        }).status(400);
    }
};
