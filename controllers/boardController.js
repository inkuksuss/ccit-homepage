import routes from "../routes";
import Video from "../models/Video";
import Photo from "../models/Photo";
import User from "../models/User"
import Comment from "../models/Comment"


// Global
export const home = (req, res) => {
        res.render("home", { pageTitle: "Home" })
};

export const search = async(req, res) => {
    const { 
        query: { term: searchingBy }
    } = req;
    let videos = [];
    let photos = [];
    try {
        videos = await Video.find({
            title: { $regex: searchingBy, $options: "i"}});
        photos = await Photo.find({
            title: { $regex: searchingBy, $options: "i"}});
    } catch(err) {
        console.log(err);
    }
    res.render("Search", { pageTitle: `${searchingBy}`, searchingBy, videos, photos });
};

// Photo
export const photos = async(req, res) => {
    try{
        const photolist = await Photo.find({}).sort({ _id: -1 });
        res.render("photos", { pageTitle: "Photo", photolist });
    } catch(err) {
        console.log(err);
        res.render("photos", { pageTitle: "Photo", photolist: [] });
    }
};

export const getPhotoUpload = (req, res) => { 
    res.render("photoUpload", { pageTitle: "Upload Photo" })};

export const postPhotoUpload = async (req, res) => {
    const {
        body: { title, description },
        file: { path }
    } = req;
    try{
        const newPhoto = await Photo.create({
            photoUrl: path,
            title,
            description,
            creator: req.user.id
        });
        req.flash('success', '업로드 성공');
        req.user.photos.push(newPhoto.id);
        req.user.save();
        res.redirect(routes.photoDetail(newPhoto.id));
    } catch(err) {
        res.redirect(routes.photoUpload);
        console.log(err);
    }
};

export const photoDetail = async(req, res) => {
    const { 
        params: { id }
    } = req;
    try {
        const photo = await Photo
            .findById(id)
            .populate("creator")
            .populate("comments");
        photo.views += 1;
        photo.save();
        res.render('photoDetail', { pageTitle: photo.title, photo })
    } catch(err) {
        console.log(err);
        res.redirect(routes.home);
    }
};

export const getEditPhoto = async(req, res) => {
    const {
        params: { id }
      } = req;
    try {
        const photo = await Photo.findById(id);
        if(String(photo.creator) !== req.user.id) {
            throw Error();
        } else {
            res.render('editPhoto', { pageTitle: `Edit ${photo.title}`, photo })
        }
    } catch(err) {
        console.log(err);
        res.redirect(routes.home);
    }
};

export const postEditPhoto = async(req, res) => {
    const { 
        params: { id },
        body: { title, description }
    } = req;
    try {
        await Photo.findOneAndUpdate({ _id: id }, { title, description });
        req.flash('success', '수정 완료');
        res.redirect(routes.photoDetail(id));
    } catch(err) {
        console.log(err);
        res.redirect(routes.home);
    }
};

export const deletePhoto = async(req, res) => {
    const {
        params: { id }
     } = req;
     try {
         const photo = await Photo.findById(id);
         if(String(photo.creator) !== req.user.id) {
            throw Error();
         } else {
            const populated = await Photo
            .findById(id)
            .populate('creator')
            .populate('comments');
            const user = await User.findById(populated.creator._id)
            const comment = await Comment.findById(populated.comments);
            const filter = user.photos.filter( index => String(index) !== `${id}`);
            user.photos = filter;
            user.save();
            await Photo.findByIdAndDelete(id);
            req.flash('success', '삭제 성공');
         }
     } catch(err) { 
         console.log(err)
     }
     res.redirect(`/boards${routes.photos}`);
};

// Video
export const videos = async(req, res) => {
    try{
        const videolist = await Video.find({}).sort({ _id: -1 });
        res.render("videos", { pageTitle: "Video", videolist });
    } catch(err) {
        console.log(err);
        res.render("videos", { pageTitle: "Video", videolist: [] });
    }
};

export const getVideoUpload = (req, res) => { 
    res.render("videoUpload", { pageTitle: "Upload Video" })};

export const postVideoUpload = async (req, res) => {
    const {
        body: { title, description },
        file: { path }
    } = req;
    try{
        const newvideo = await Video.create({
            videoUrl: path,
            title,
            description,
            creator: req.user.id
        });
        req.flash('success', '업로드 성공');
        req.user.videos.push(newvideo.id);
        req.user.save();
        res.redirect(routes.videoDetail(newvideo.id));
    } catch(err) {
        res.redirect(routes.videoUpload);
        console.log(err);
    }
};

export const getVideoDetail = async(req, res) => {
    const { 
        params: { id }
    } = req;
    try {
        const video = await Video
            .findById(id)
            .populate("creator")
            .populate("comments");
        res.render("videoDetail", { pageTitle: video.title, video });
    } catch(err) {
        console.log(err);
        res.redirect(routes.home);
    }
};

export const postVideoDetail = async(req, res) => {
    const {
        user,
        params: { id } 
    } = req;
    try {
        const videoCreator = await User.findOne({ videos: id });
        res.json({
            loggedUser: user.id,
            loggedUserName: user.name,
            videoCreator: videoCreator.id
        });
    } catch(err) {
        console.log(err);
    } finally {
        res.end();
    }
}

export const getEditVideo = async(req, res) => {
    const {
        params: { id }
      } = req;
    try {
        const video = await Video.findById(id);
        if(String(video.creator) !== req.user.id) {
            throw Error();
        } else {
            res.render('editVideo', { pageTitle: `Edit ${video.title}`, video })
        }
    } catch(err) {
        console.log(err);
        res.redirect(routes.home);
    }
};

export const postEditVideo = async(req, res) => {
    const { 
        params: { id },
        body: { title, description }
    } = req;
    try {
        await Video.findOneAndUpdate({ _id: id }, { title, description });
        req.flash('success', '수정 완료');
        res.redirect(routes.videoDetail(id));
    } catch(err) {
        console.log(err);
        res.redirect(routes.home);
    }
};

export const deleteVideo = async(req, res) => {
    const {
        params: { id },
        user
     } = req;
     try {
         const video = await Video.findById(id)
         if (String(video.creator) !== user.id) {
            throw Error();
         } else {
            const video = await Video
                .findById(id)
                .populate('creator')
                .populate('comments');
            const user = await User.findById(video.creator._id)
            const filter = user.videos.filter( index => String(index) !== `${id}`);
            user.videos = filter;
            user.save();
            await Video.findByIdAndDelete(id)
            req.flash('success', '삭제 완료');
         }
     } catch(err) { 
         console.log(err)
     }
     res.redirect(`/boards${routes.videos}`);
};

// Register Video View
export const postRegiserView = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const video = await Video.findById(id);
        video.views += 1;
        video.save();
        res.status(200);
    } catch(err) {
        res.status(400);
    } finally {
        res.end();
    }
};

// Add Comments
export const postAddVideoComment = async (req, res) => {
    const {
        params: { id },
        body: { comment, displayName },
        user
    } = req;
    try {
        const video = await Video.findById(id);
        const userComment = await User.findById(user.id);
        const newComment = await Comment.create({
            text: comment,
            creator: user.id,
            displayName
        });
        userComment.comments.push(newComment);
        userComment.save();
        video.comments.push(newComment.id);
        video.save();
        newComment.save();
    } catch (err) {
        res.status(400);
    } finally {
        res.end();
    }
};

export const postDeleteVideoComment = async (req, res) => {
    const {
        params: { id },
        body: { commentId },
        user
    } = req;
    try {
        const video = await Video.findById(id).populate('comments');
        const comment = await Comment.findById(commentId);
        console.log(user.id);
        if (user.id !== String(video.creator) && user.id !== String(comment.creator)){
            throw Error();
        } else {
            const creator = await User.findById(comment.creator);
            const commentFilter = await creator.comments.filter( index => String(index) !== `${commentId}`);
            const videoFilter = await video.comments.filter( index => String(index) !== `${commentId}`);
            creator.comments = commentFilter;
            video.comments = videoFilter;
            creator.save();
            video.save();
            await Comment.findByIdAndDelete(commentId);
            req.flash('success', '삭제 완료');
        }
    } catch(err){
        res.status(400);
    } finally {
        res.end();
    }
}
