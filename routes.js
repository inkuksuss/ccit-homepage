// Global
const HOME = "/";
const JOIN = "/join";
const LOGIN = "/login";
const LOGOUT = "/logout";
const SEARCH = "search";

// Users
const USERS = "/users";
const USER_DETAIL = "/:id";
const EDIT_PROFILE = "/edit-profile";
const CHANGE_PASSWORD = "/change-password";

// Boards
const BOARDS = "/boards";
const UPLOAD = "/upload";
const BOARD_DETAIL = "/:id";
const EDIT_BOARD = "/:id/edit";
const DELETE_BOARD = "/:id/delete";

const routes = {
    //Global
    home: HOME,
    join: JOIN,
    login: LOGIN,
    logout: LOGOUT,
    search: SEARCH,

    //Users
    users: USERS,
    userDetail: USER_DETAIL,
    editProfile: EDIT_PROFILE,
    changePassword: CHANGE_PASSWORD,

    //Boards
    boards: BOARDS,
    upload: UPLOAD,
    boardDetail: BOARD_DETAIL,
    editBoard: EDIT_BOARD,
    deleteBoard: DELETE_BOARD
};

export default routes;

