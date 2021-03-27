import routes from "../routes";
import Board from "../models/Board";


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

export const postUpload = async(req, res) => {
    const {
        body: { title, description },
        file: { path }
    } = req;
    // To Do: Upload and save video
    const newBoard = await Board.create({
        fileUrl: path,
        title,
        description
    });
    res.redirect(routes.boardDetail(newBoard.id));
};

export const boardDetail = async(req, res) => {
    const { 
        params: { id }
    } = req;
    try {
        const board = await Board.findById(id);
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
        res.render("editBoard", { pageTitle: `Edit ${board.title}`, board })
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
         await Board.findOneAndDelete({ _id: id }) 
     } catch(err) { 
         console.log(err)
     }
     res.redirect(routes.home);
};

    