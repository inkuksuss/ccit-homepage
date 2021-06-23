/* eslint-disable object-shorthand */
/* eslint-disable no-restricted-syntax */
import Mongoose from "mongoose";
import User from '../models/User';
import Photo from '../models/Photo';
import Video from "../models/Video";
import Comment from "../models/Comment";
import Complain from "../models/Complain";
import PhotoComplain from "../models/PhotoComplain";

const { Types: { ObjectId } } = Mongoose

export const postDeleteVideo = async(req, res) => {
    const { 
        params: { id }
    } = req;
    try {
        const video = await Video.findById(id).populate('complain').populate('comments');
        const { comments } = video;
        const { complain: complains } = video;
        const { creator } = video;
        if(comments.length > 0) {
            for await(const comment of comments) {
                await Comment.findByIdAndDelete(comment.id);
                await User.findByIdAndUpdate(comment.complainer, {$pull: { videoComplain: new ObjectId(id) }}); 
                await User.findByIdAndUpdate(comment.creator, {$pull: { comments: comment }});
            }
        }
        for await(const complain of complains) {
            await Complain.findByIdAndDelete(complain.id);
        }
        await User.findByIdAndUpdate(creator, {$pull: { videos: id }})
        await Video.findByIdAndDelete(id);
        res.status(200).end();
    } catch(err) {
        throw Error();
    }
};

export const postDeletePhoto = async(req, res) => {
    const { 
        params: { id }
    } = req;
    try {
        const photo = await Photo.findById(id).populate('complain').populate('comments');
        const { comments } = photo;
        const { complain: complains } = photo;
        const { creator } = photo;
        if(comments.length > 0) {
            for await(const comment of comments) {
                await Comment.findByIdAndDelete(comment.id);
                await User.findByIdAndUpdate(comment.complainer, {$pull: { photoComplain: new ObjectId(id) }}); 
                await User.findByIdAndUpdate(comment.creator, {$pull: { comments: comment }});
            }
        }
        for await(const complain of complains) {
            await PhotoComplain.findByIdAndDelete(complain.id);
        }
        await User.findByIdAndUpdate(creator, {$pull: { photos: id }})
        await Photo.findByIdAndDelete(id);
        res.status(200).end();
    } catch(err) {
        throw Error();
    }
};