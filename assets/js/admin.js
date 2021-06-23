// const videoComplainBox = document.querySelector('.videoComplain__box');
// const photoComplainBox = document.querySelector('.photoComplain__box');
// const videoComplain = document.getElementById('jsVideoComplain').value;
// const photoComplain = document.getElementById('jsPhotoComplain').value;
import axios from "axios";
import routes from "../../routes"

const deleteVideoBtn = document.getElementById('jsAdminVideoDelete');
const deletePhotoBtn = document.getElementById('jsAdminPhoto.Delete');

const deletePhoto = async() => {
    const photoId = window.location.href.split('/photo/')[1];
    const response = await axios.post(`/admin/photo/delete/${photoId}`);
    if(response.status === 200) {
        window.location.href = routes.home;
    }
}

const deleteVideo = async() => {
    const videoId = window.location.href.split('/video/')[1];
    const response = await axios.post(`/admin/video/delete/${videoId}`);
    if(response.status === 200) {
        window.location.href = routes.home;
    }
};

function admininit() {
    if(deletePhotoBtn) {
        deletePhotoBtn.addEventListener('click', deletePhoto);
    }
    if(deleteVideoBtn) {
        deleteVideoBtn.addEventListener('click', deleteVideo);
    }
};

if(deleteVideoBtn || deletePhoto) {
    admininit();
}

