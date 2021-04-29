/* eslint-disable no-unused-vars */
import axios from "axios";

const addVideoCommentForm = document.getElementById("jsAddVideoComment");
const commentVideoList = document.getElementById("jsCommentVideoList");
const commentVideoNumber = document.getElementById("jsCommentVideoNumber");
const deleteVideoCommentForms = document.querySelectorAll('.jsDeleteVideoComment');
const updateVideoCommentForms = document.querySelectorAll('.jsUpdateVideoComment');

let loggedUser;
let loggedUserName;
// let videoCreator;

const increaseVideoNumber = () => {
    commentVideoNumber.innerHTML = parseInt(commentVideoNumber.innerHTML, 10) + 1;
};

const decreaseVideoNumber = () => {
    commentVideoNumber.innerHTML = parseInt(commentVideoNumber.innerHTML, 10) - 1;
}

// 추가
const reloadVideoPage = () => {
    window.location.reload();
};

const addVideoComment = comment => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const link = document.createElement("a");
    const reloadBtn = document.createElement('button');
    const icon = document.createElement('i');
    span.innerHTML = comment;
    link.innerHTML = loggedUserName;
    link.setAttribute("href",`/users/${loggedUser}`);
    li.append(span, link, reloadBtn);
    icon.classList.add("fas", "fa-sync-alt")
    reloadBtn.appendChild(icon);
    reloadBtn.addEventListener('click', reloadVideoPage);
    commentVideoList.prepend(li); 
    increaseVideoNumber();
};

const sendVideoComment = async (comment) => {
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
        addVideoComment(comment);
    }
};

const handleVideoSubmit = event => {
    event.preventDefault();
    const commentInput = addVideoCommentForm.querySelector("input");
    const comment = commentInput.value;
    if(loggedUser){
        sendVideoComment(comment);
        commentInput.value = "";
    } else {
        alert("로그인 후 작성 가능합니다.");
        commentInput.value = "";
    }
};


function addVideoInit() {
    addVideoCommentForm.addEventListener("submit", handleVideoSubmit);
};

//삭제
const deleteVideoComment = async(commentId) => {
    const videoId = window.location.href.split("/boards/video/")[1];
    await axios({
        url: `/api/${videoId}/video/comment/delete`,
        method: "POST",
        data: {
            commentId
        }
    });
}

const handleVideoDelete = (event) => {
    event.preventDefault();
    const commentInput = event.target.querySelector(".jsDeleteVideoInput");
    const commentId = commentInput.value;
    event.currentTarget.parentNode.remove();
    deleteVideoComment(commentId);
    decreaseVideoNumber();
}


function deleteVideoInit() {
    for(let i = 0; i < deleteVideoCommentForms.length; i++) {
        deleteVideoCommentForms[i].addEventListener("submit", handleVideoDelete);
    };
}

// 수정
const updateVideoComment = (comment, commentId) => {
    const inputContainer = document.querySelectorAll('.jsUpdateVideoTarget');
    for(let i = 0; i < inputContainer.length; i++) {
        if(inputContainer[i].value === commentId) {
            const targetInput = inputContainer[i];
            const form = targetInput.parentNode;
            const li = form.parentNode;
            li.firstChild.innerHTML = `${comment}`;
        };
    };
}

const sendVideoUpdate = async (comment, commentId) => {
    const videoId = window.location.href.split("/boards/video/")[1];
    const response = await axios({
        url: `/api/${videoId}/video/comment/update`,
        method: "POST",
        data: {
            comment,
            commentId
        }
    });
    if (response.status === 200) {
        updateVideoComment(comment,commentId);
    }
};

const handleVideoUpdate = (event) => {
    event.preventDefault();
    const updateInput = event.target.querySelector('.jsUpdateVideoInput');
    const updateTarget = event.target.querySelector('.jsUpdateVideoTarget');
    updateInput.classList.toggle("visible");
    const comment = updateInput.value;
    const commentId = updateTarget.value;
    if(comment) {
        if(confirm("정말 수정하시겠습니까?")) {
            sendVideoUpdate(comment, commentId);
            updateInput.value = "";
        }
    };
};

function updateVideoInit() {
    for(let i = 0; i < updateVideoCommentForms.length; i++) {
        updateVideoCommentForms[i].addEventListener("submit", handleVideoUpdate);
    };
};

const authenticationVideoUser = async() => {
    const url = window.location.href;
    try {
        await axios.post(url)
        .then(res => {
            loggedUser = res.data.loggedUser;
            loggedUserName = res.data.loggedUserName;
            // videoCreator = res.data.videoCreator;
        })
    } catch(err) {
        alert("로그인 유저 정보를 가져올 수 없습니다");
        console.log(err);
    } finally {
        addVideoInit();
        deleteVideoInit();
        updateVideoInit();
    }
};

if(addVideoCommentForm){
    authenticationVideoUser();
}