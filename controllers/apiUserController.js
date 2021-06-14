/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable object-shorthand */
import passport from "passport";
import { PythonShell } from "python-shell";
import Mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Food from "../models/Food";

const scriptPath = '/Users/gim-ingug/Documents/ccit-homepage/.venv'
const { Types: { ObjectId } } = Mongoose;

const korea = new Date(); 
const year = korea.getFullYear();
const month = korea.getMonth();
const lastMon = korea.getMonth() - 1;
const date = korea.getDate()+1; // 수정
const today = new Date(Date.UTC(year, month, date));
const lastMonth = new Date(Date.UTC(year, lastMon, date));

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
            const token = jwt.sign( // jwt 토큰 생성
                { _id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            user.token = token; 
            user.save(); // 유저 디비 저장
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

export const getApiProductDetail = async(req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const foods = await Food.aggregate([
            { $match: { $and: [{ product: new ObjectId(id) }, { time: { $gte: lastMonth, $lt: today }}] }},
            {
                $group: {
                    "_id": { "$week": "$time"},
                    avgFoodValue: { $avg: "$amount" },
                    avgRestValue: { $avg: "$rest" }
                }
            },
            { $sort: { _id: 1 }}
        ]);
        const weights = await Weight.aggregate([
            { $match: { $and: [{ product: new ObjectId(id) }, { time: { $gte: lastMonth, $lt: today }}] }},
            {
                $group: {
                    "_id": { "$week": {"$toDate": "$time"} },
                    avgWeightValue: { $avg: "$weg" }
                }
            },
            { $sort: { _id: 1 }}
        ]);
        const dateBox = [];
        const FoodBox = [];
        const RestBox = [];
        const WeightBox = [];
        const WeightDateBox = [];
        for(const food of foods) {
            const startYear = new Date(Date.UTC(year, 0, 1));
            const neededDate = new Date(startYear.setDate(startYear.getDate() + (food._id * 7)))
            const neededYear = neededDate.getFullYear();
            const neededMonth = neededDate.getMonth() + 1;
            const neededDay = neededDate.getDate();
            const needDate = `${neededYear}-${neededMonth < 10 ? `0${neededMonth}` : `${neededMonth}`}-${neededDay < 10 ? `0${neededDay}` : `${neededDay}`}`
            dateBox.push(needDate);
            FoodBox.push(food.avgFoodValue !== null ? food.avgFoodValue : 0);
            RestBox.push(food.avgRestValue !== null ? food.avgRestValue : 0)
        }
        for(const weight of weights) {
            const startYear = new Date(Date.UTC(year, 0, 1));
            const neededDate = new Date(startYear.setDate(startYear.getDate() + (weight._id * 7)))
            const neededYear = neededDate.getFullYear();
            const neededMonth = neededDate.getMonth() + 1;
            const neededDay = neededDate.getDate();
            const needDate = `${neededYear}-${neededMonth < 10 ? `0${neededMonth}` : `${neededMonth}`}-${neededDay < 10 ? `0${neededDay}` : `${neededDay}`}`
            WeightDateBox.push(needDate);
            WeightBox.push(weight.avgWeightValue !== null ? weight.avgWeightValue : 0);
        }
        return res.json({
            FoodBox,
            RestBox, 
            dateBox, 
            WeightBox, 
            WeightDateBox,
            id, 
        })
    } catch(err) {
        console.log(err)
    }

};

export const postApiProductDetail = (req, res) => {
    const {
        params: { id },
        body: { 
            data
        }
    } = req;
    PythonShell.run('ChartPage.py', {
        mode: 'json',
        pythonOptions: ['-u'],
        scriptPath,
        args: [id, data.start, data.end]
    }, (err, result) => {
        if(err) {
            return console.log(err);
        }
        const dateBox = result[0]
        const dataList = result[1]
        console.log(dataList.amount);
        console.log(dataList.rest)
        if(data !== [] && dataList !== {}) {
            console.log(dataList);
            return res.json({
                success: true,
                dateBox,
                amount: dataList.amount,
                rest: dataList.rest,
                weight: dataList.weight
            })
        } 
        return res.json({
            success: false,
            dateBox: [],
            amount: [],
            rest: [],
            weight: []
        })
    })
};
