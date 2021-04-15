import routes from "../routes";
import Board from "../models/Board";
import User from "../models/User"
import Comment from "../models/Comment"


// Global
export const home = async(req, res) => {
    try{
        const boards = await Board.find({}).sort({ _id: -1 });
        res.render("home", { pageTitle: "Home", boards })
    } catch(error) {
        console.log(error);
        res.render("home", { pageTitle: "Home", boards: [] });
    }
};

export const postHome = async (req, res) => {
    const { 
        body: { user }
    } = req;
    const jsonUser = JSON.parse(user);
    try {
        const loggedUser = await User.findOne({ email: jsonUser.email });
        const boards = await Board.find({}).sort({ _id: -1 });
        res.render('home', { loggedUser, boards });
    } catch (err) {
        console.log(err);
        res.redirect(routes.login);
    }
};

export const search = async(req, res) => {
    const { 
        query: { term: searchingBy }
    } = req;
    let boards = [];
    try {
        boards = await Board.find({
            title: { $regex: searchingBy, $options: "i"}});
    } catch(err) {
        console.log(err);
    }
    res.render("Search", { pageTitle: `${Board.title}`, searchingBy, boards })
    
};

//Board
export const boards = (req, res) => {
    res.render("boards", { pageTitle: "Board" })};

export const getUpload = (req, res) => { 
    res.render("Upload", { pageTitle: "Upload" })};

export const postUpload = async (req, res) => {
    const {
        body: { title, description },
        file: { path }
    } = req;
    // To Do: Upload and save video
    try{
        const newBoard = await Board.create({
            fileUrl: path,
            title,
            description,
            creator: req.user.id
        });
        req.user.boards.push(newBoard.id);
        req.user.save();
        res.redirect(routes.boardDetail(newBoard.id));
    } catch(err) {
        res.redirect(routes.getUpload);
        console.log(err);
    }
};

export const boardDetail = async(req, res) => {
    const { 
        params: { id }
    } = req;
    try {
        const board = await Board.findById(id).populate("creator").populate("comments");
        res.render("boardDetail", { pageTitle: board.title, board })
    } catch(error) {
        // alert("존재하지 않는 게시물입니다");
        res.redirect(routes.home);
    }
};

export const getEditBoard = async(req, res) => {
    const {
        params: { id }
      } = req;
    try {
        const board = await Board.findById(id);
        if(board.creator.toString() !== req.user.id) {
            throw Error();
        } else {
            res.render('editBoard', { pageTitle: `Edit ${board.title}`, board })
        }
    } catch(err) {
        res.redirect(routes.home);
    }
};

export const postEditBoard = async(req, res) => {
    const { 
        params: { id },
        body: { title, description }
    } = req;
    try {
        await Board.findOneAndUpdate({ _id: id }, { title, description });
        res.redirect(routes.boardDetail(id));
    } catch(err) {
        res.redirect(routes.home);
    }
};

export const deleteBoard = async(req, res) => {
    const {
        params: { id }
     } = req;
     try {
         const board = await Board.findById(id);
         if(board.creator.toString() !== req.user.id) {
            throw Error();
         } else {
            await Board.findOneAndDelete(id) 
         }
     } catch(err) { 
         console.log(err)
     }
     res.redirect(routes.home);
};

// Register Board View
export const postRegiserView = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const board = await Board.findById(id);
        board.views += 1;
        board.save();
        res.status(200);
    } catch(err) {
        res.status(400);
    } finally {
        res.end();
    }
};

// Add Comments
export const postAddComment = async (req, res) => {
    const {
        params: { id },
        body: { comment },
        user
    } = req;
    try {
        const board = await Board.findById(id);
        const userComment = await User.findById(user.id);
        const newComment = await Comment.create({
            text: comment,
            creator: user.id
        });
        userComment.comments.push(newComment);
        board.comments.push(newComment.id);
        board.save();
        userComment.save();
    } catch (err) {
        res.status(400);
    } finally {
        res.end();
    }
};

