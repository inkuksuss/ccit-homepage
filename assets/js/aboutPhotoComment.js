/* eslint-disable no-restricted-globals */
/* eslint-disable object-shorthand */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
import axios from "axios";

const addPhotoCommentForm = document.getElementById("jsAddPhotoComment");
const commentPhotoList = document.getElementById("jsCommentPhotoList");
const commentPhotoNumber = document.getElementById("jsCommentPhotoNumber");
const deletePhotoCommentForms = document.querySelectorAll('.jsDeletePhotoComment');
const updatePhotoCommentForms = document.querySelectorAll('.jsUpdatePhotoComment');
const photoId = window.location.href.split("/boards/photo/")[1];

let loggedUser;
let loggedUserName;

const increasePhotoNumber = () => {
    commentPhotoNumber.innerHTML = parseInt(commentPhotoNumber.innerHTML, 10) + 1;
};

const decreasePhotoNumber = () => {
    commentPhotoNumber.innerHTML = parseInt(commentPhotoNumber.innerHTML, 10) - 1;
};

// 추가
const reloadPhotoPage = () => {
    window.location.reload();
};

const addPhotoComment = comment => {
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
    reloadBtn.addEventListener('click', reloadPhotoPage);
    commentPhotoList.prepend(li); 
    increasePhotoNumber();
};

const sendPhotoComment = async (comment) => {
    const response = await axios({
        url: `/api/${photoId}/photo/comment/add`,
        method: "POST",
        data: {
            comment,
            displayName: loggedUserName
        }
    });
    if (response.status === 200) {
        addPhotoComment(comment);
    }
};

const handlePhotoSubmit = event => {
    event.preventDefault();
    const commentInput = addPhotoCommentForm.querySelector("input");
    const comment = commentInput.value;
    if(loggedUser){
        sendPhotoComment(comment);
        commentInput.value = "";
    } else {
        alert("로그인 후 작성 가능합니다.");
        commentInput.value = "";
    }
};


function addPhotoInit() {
    addPhotoCommentForm.addEventListener("submit", handlePhotoSubmit);
};

//삭제
const deletePhotoComment = async(commentId) => {
    const photoId = window.location.href.split("/boards/photo/")[1];
    await axios({
        url: `/api/${photoId}/photo/comment/delete`,
        method: "POST",
        data: {
            commentId
        }
    });
}

const handlePhotoDelete = (event) => {
    event.preventDefault();
    const commentInput = event.target.querySelector(".jsDeletePhotoInput");
    const commentId = commentInput.value;
    event.currentTarget.parentNode.remove();
    deletePhotoComment(commentId);
    decreasePhotoNumber();
}


function deletePhotoInit() {
    for(const deletePhotoCommentForm of deletePhotoCommentForms) {
        deletePhotoCommentForm.addEventListener("submit", handlePhotoDelete);
    };
};

// 수정
const updatePhotoComment = (comment, commentId) => {
    const inputContainer = document.querySelectorAll('.jsUpdatePhotoTarget');
    for(const input of inputContainer) {
        if(input.value === commentId) {
            const targetInput = input;
            const form = targetInput.parentNode;
            const li = form.parentNode;
            li.firstChild.innerHTML = `${comment}`;
        };
    };
};

const sendPhotoUpdate = async (comment, commentId) => {
    const photoId = window.location.href.split("/boards/Photo/")[1];
    const response = await axios({
        url: `/api/${photoId}/photo/comment/update`,
        method: "POST",
        data: {
            comment,
            commentId
        }
    });
    if (response.status === 200) {
        updatePhotoComment(comment,commentId);
    }
};

const handlePhotoUpdate = (event) => {
    event.preventDefault();
    const updateInput = event.target.querySelector('.jsUpdatePhotoInput');
    const updateTarget = event.target.querySelector('.jsUpdatePhotoTarget');
    updateInput.classList.toggle("visible");
    const comment = updateInput.value;
    const commentId = updateTarget.value;
    if(comment) {
        if(confirm("정말 수정하시겠습니까?")) {
            sendPhotoUpdate(comment, commentId);
            updateInput.value = "";
        }
    };
};

function updatePhotoInit() {
    for(const updatePhotoCommentForm of updatePhotoCommentForms) {
        updatePhotoCommentForm.addEventListener("submit", handlePhotoUpdate);
    };
};

const authenticationPhotoUser = async() => {
    const url = window.location.href;
    try {
        await axios.post(url)
        .then(res => {
            loggedUser = res.data.loggedUser;
            loggedUserName = res.data.loggedUserName;
        })
    } catch(err) {
        alert("로그인 유저 정보를 가져올 수 없습니다");
        console.log(err);
    } finally {
        addPhotoInit();
        deletePhotoInit();
        updatePhotoInit();
    }
};

const registerPhotoView = () => {
    fetch(`/api/photo/${photoId}/view`, {
        method: "POST"
    });
};

function checkCookie() {
    if(!document.cookie.split(';').some(item => item.includes(photoId))) {
        registerPhotoView();
        document.cookie = `${photoId}=true`;
    };
};

if(addPhotoCommentForm){
    authenticationPhotoUser();
    checkCookie();
};