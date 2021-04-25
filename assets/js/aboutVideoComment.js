import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const deleteCommentForms = document.querySelectorAll('.jsDeleteComment');

let loggedUser;
let loggedUserName;
let videoCreator;

const increaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addComment = comment => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const link = document.createElement("span");
    span.innerHTML = comment;
    link.innerHTML = loggedUserName;
    li.append(span, link);
    commentList.prepend(li); 
    increaseNumber();
};

const sendComment = async (comment) => {
    const videoId = window.location.href.split("/boards/video/")[1];
    const response = await axios({
        url: `/api/${videoId}/video/comment/add`,
        method: "POST",
        data: {
            comment,
            displayName: loggedUserName
        }
    });
    if (response.status === 200) {
        addComment(comment);
    }
};

const handleSubmit = event => {
    event.preventDefault();
    const commentInput = addCommentForm.querySelector("input");
    const comment = commentInput.value;
    sendComment(comment);
    commentInput.value = "";
};


function addInit() {
    addCommentForm.addEventListener("submit", handleSubmit);
};

const deleteComment = async(commentId) => {
    const videoId = window.location.href.split("/boards/video/")[1];
    await axios({
        url: `/api/${videoId}/video/comment/delete`,
        method: "POST",
        data: {
            commentId
        }
    });
}

const handleDelete = (event) => {
    event.preventDefault();
    const commentInput = event.target.querySelector(".jsDeleteInput");
    const commentId = commentInput.value;
    event.currentTarget.parentNode.remove();
    deleteComment(commentId);
}


function deleteInit() {
    for(let i = 0; i < deleteCommentForms.length; i++) {
        deleteCommentForms[i].addEventListener("submit", handleDelete);
    };
}

const authenticationUser = async() => {
    const url = window.location.href;
    try {
        await axios.post(url)
        .then(res => {
            loggedUser = res.data.loggedUser;
            loggedUserName = res.data.loggedUserName;
            videoCreator = res.data.videoCreator;
        })
    } catch(err) {
        console.log(err);
    }
    if(loggedUser && videoCreator && loggedUserName) { 
        addInit();
        deleteInit();
    }
};

if(addCommentForm){
    authenticationUser();
}