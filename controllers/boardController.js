import routes from "../routes";
import Board from "../models/Board";

// Global
export const home = async(req, res) => {
    try{
        const boards = await Board.find({});
        res.render("home", { pageTitle: "Home", boards })
    } catch(error) {
        console.log(error);
        res.render("home", { pageTitle: "Home", boards: [] });
    }
}; 

export const search = (req, res) => {
    const { 
        query: { term: searchingBy }
    } = req;
    res.render("Search", { pageTitle: "Search", searchingBy, boards })
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

export const editBoard = (req, res) => {
    res.render("editBoard", { pageTitle: "Edit Board" })};

export const deleteBoard = (req, res) => {
    res.render("deleteBoard", { pageTitle: "Delete Board" })};

export const boardDetail = async(req, res) => {
    const { 
        params: { id }
    } = req;
    try {
        const board = await Board.findById(id);
        res.render("boardDetail", { pageTitle: "Board Detail", board })
    } catch(error) {
        alert("존재하지 않는 게시물입니다");
        res.redirect(routes.home);
    }
};
    