/* eslint-disable no-restricted-syntax */
/* eslint-disable object-shorthand */
import dotenv from 'dotenv';
import socketIO from "socket.io";
import mqtt from "mqtt";
import "./db";
import app from './app';
import "./models/Comment";
import "./models/Video";
import "./models/Photo";
import User from "./models/User";
import Product from "./models/Product";
import Food from "./models/Food";

// const obj = JSON.parse(message);
// const date = new Date();
// const year = date.getFullYear();
// const month = date.getMonth();
// const today = date.getDate();
// const hours = date.getHours();
// const mintues = date.getMinutes();
// const seconds = date.getSeconds();
// obj.createdAt = new Date(Date.UTC(year, month, today, hours, mintues, seconds));


dotenv.config();

const PORT = process.env.PORT || 4000;

const handleListing = () =>
console.log(`😈Listening on: http://localhost:${PORT}`);
// 웹서버
const server = app.listen(PORT, handleListing);

const options = {
    port: 1883,
    username: 'inguk',
    password: 'ccit2',
    clientId: '123'
};

//Mqtt 서버
const client = mqtt.connect("mqtt://114.71.241.151", options);

client.on("connect", () => {
    console.log("😇Mqtt Connect");
    client.subscribe('jb/ccit/dogbab/smit/petoy/+/cb');
    client.subscribe('jb/ccit/dogbab/smit/petoy/+/+/output/stepmt/+/cb'); 
    client.subscribe('jb/ccit/dogbab/smit/petoy/+/+/input/+'); 
});

client.on("message", async (topic, message) => {
    const obj = JSON.parse(message);
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = date.getDate();
    const hours = date.getHours();
    const mintues = date.getMinutes();
    const seconds = date.getSeconds();
    const contaienr = topic.split('/')
    obj.createdAt = new Date(Date.UTC(year, month, today, hours, mintues, seconds));
    try{
        if(contaienr.length === 6 && contaienr[6] === "cb") {
            const { success, serNum, userId } = obj;
            if(success) {
                await User.findByIdAndUpdate(userId, {$push: { key: serNum }});
            }
            

        }
    } catch (err) {
        console.log({ message: err });
    }
});

// 웹소켓서버
const io = socketIO(server);

io.on("connection", socket => {
    console.log("😘Socket Connect")
    // 채팅  
    socket.on("newMessage", ({ message }) => {  
        socket.broadcast.emit("messageNotif", {
            message,
            nickname: socket.nickname || "Inguk"
        });
    });
    socket.on("setNickname", ({ nickname }) => {
        socket.nickname = nickname;
    });
    // Mqtt 데이터
    // socket.on("mqttSubmit", () => {
    //     DHT.find({}).sort({ _id: -1 }).limit(1).then(res => {
    //         socket.emit("mqttSubmit", JSON.stringify(res[0]))
    //     })
    // })

    socket.on("deviceAuth", (key) => {
        key.order = 1;
        const jsonKey = JSON.stringify(key)
        const authTopic = `jb/ccit/dogbab/smit/petoy/${key.key}`
        console.log(jsonKey)
        client.publish(authTopic, jsonKey, err => {
            if(err) {
                return console.log(err);
            }
            client.on("message", async (topic, message) => {
                const container = topic.split('/');
                try{
                    if(container.length === 7 && container[5] === key.key && container[6] === "cb") {
                        const result = JSON.parse(message);
                        const { success, serNum } = result;
                        console.log(success, serNum)
                        if(success) {
                            const exist = await Product.findOne({ key: serNum })
                            if(!exist) {
                                return socket.emit("deviceRegister", true);
                            } else {
                                return socket.emit("deviceRegister", false);
                            }
                        } else {
                            return socket.emit("deviceRegister", false);
                        }
                    }
                } catch (error) {
                    console.log( error );
                }
            })
        });
    });
    socket.on("sendControl", async(order) => {
        if(order) {
        const { keyName, userId, time, amount } = order;
        const sending = {
            time,
            amount,
            order: 3,
            userId
        }
        console.log(sending);
        console.log(`jb/ccit/dogbab/smit/petoy/${userId}/${keyName}/stepmt/ad`);
        const jsSending = JSON.stringify(sending);
            client.publish(`jb/ccit/dogbab/smit/petoy/${userId}/${keyName}/stepmt/ad`, jsSending, async(err) => {
                if(err) {
                    return console.log(err);
                }
                console.log(jsSending)
                client.on("message", async(topic, message) => {
                    console.log('asdasd')
                    if(topic === `jb/ccit/dogbab/smit/petoy/${userId}/${keyName}/stepmt/ad`) {
                        const result = JSON.parse(message);
                        console.log(result)
                        const { success, time: { timeArray } } = result;
                        if(success) {
                            try {
                                const product = await Product.findOne({ key: keyName });
                                for await(const times of timeArray) {
                                    const receiveDate = times.split(' ')[0]
                                    const receiveTime = times.split(' ')[1]
                                    const nowDate = receiveDate.split("-");
                                    const nowTime = receiveTime.split(":");
                                    const date = new Date(Date.UTC(
                                        Number(nowDate[0]), Number(nowDate[1]) - 1, Number(nowDate[2]),
                                        Number(nowTime[0]), Number(nowTime[1]), Number(nowTime[2]),          
                                    ));
                                    const data = await Food.create({
                                        controller: userId,
                                        product,
                                        time: date,
                                        amount: Math.round(amount)
                                    })
                                    data.save();
                                }
                                setTimeout(() => {
                                    socket.on('sendControlCb', true);
                                }, 1000);
                            } catch(error) {
                                setTimeout(() => {
                                    socket.on('sendControlCb', false);
                                }, 1000);
                                console.log(error);
                            }
                        }; 
                    }
                })
            });
        }
    });
    socket.on("sendOneControl", (order) => {
        if(order) {
        const { keyName, userId, amount } = order;
        const sending = {
            amount,
            order: 2,
            userId
        }
        const jsSending = JSON.stringify(sending);
        console.log(jsSending)
        console.log(`jb/ccit/dogbab/smit/petoy/${userId}/${keyName}/output/stepmt/now`);
            client.publish(`jb/ccit/dogbab/smit/petoy/${userId}/${keyName}/output/stepmt/now`, jsSending, err => {
                if(err) {
                    return console.log(err);
                }
                client.on("message", async(topic, message) => {
                    const result = JSON.parse(message.toString());
                    console.log(result);
                    if(topic === `jb/ccit/dogbab/smit/petoy/${userId}/${keyName}/output/stepmt/now/cb`) {
                        const { success, time } = result;
                        const receiveDate = time.split(' ')[0]
                        const receiveTime = time.split(' ')[1]
                        const nowDate = receiveDate.split("-");
                        const nowTime = receiveTime.split(":");
                        const date = new Date(Date.UTC(
                            Number(nowDate[0]), Number(nowDate[1]) - 1, Number(nowDate[2]),
                            Number(nowTime[0]), Number(nowTime[1]), Number(nowTime[2]),          
                        ));
                        console.log(date)
                        if(success) {
                            try {
                                const product = await Product.findOne({ key: keyName });
                                const data = await Food.create({
                                    controller: userId,
                                    product,
                                    time: date,
                                    amount: Math.round(amount)
                                });
                                console.log(data);
                                data.save();
                                setTimeout(() => {
                                    socket.emit('sendOneControlCb', true);
                                }, 1500);
                            } catch(error) {
                                setTimeout(() => {
                                    socket.emit('sendOneControlCb', false);
                                }, 1500);
                                console.log(error);
                            }
                        }; 
                    } else if(topic === `jb/ccit/dogbab/smit/petoy/${userId}/${keyName}/input/smalllod`) {
                        const { success, time } = result;
                        const receiveDate = time.split(' ')[0]
                        const receiveTime = time.split(' ')[1]
                        const nowDate = receiveDate.split("-");
                        const nowTime = receiveTime.split(":");
                        const date = new Date(Date.UTC(
                            Number(nowDate[0]), Number(nowDate[1]) - 1, Number(nowDate[2]),
                            Number(nowTime[0]), Number(nowTime[1]), Number(nowTime[2]),          
                        ));
                        if(success) {
                            const topicKey = topic.split('/')[6];
                            console.log(topicKey)
                            try {
                                const product = await Product.findOne({ key: topicKey });
                                await Food.findOneAndUpdate({ product, time: date }, { rest: Math.round(result.rest) });
                                return console.log(result.rest)
                            } catch(error) {
                                console.log(error)
                            }
                        } 
                    } 
                })
            });
        }
    })
});


