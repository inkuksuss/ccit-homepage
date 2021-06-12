const section = document.querySelector('.section');
const keyList = document.querySelector('.user-device-keyList');
const remoteBox = document.querySelector('.remote__controller');
const remoteList = document.querySelector('.remote__list');
const remoteBtn = document.querySelector('.remote__btn');
const sendOneBtn = document.getElementById('sendOne');
const sendBtn = document.getElementById('sendOrder');


const btnSelect = (event) => {
    sendBtn.setAttribute('value', event.currentTarget.name);
    sendOneBtn.setAttribute('value', event.currentTarget.name);
}

const remoteCreator = () => {
    const userKeyList = JSON.parse(keyList.value);
    const userKey = userKeyList.key;
    for (let i = 0; i < userKey.length; i++) {
        const keyBtn = document.createElement('button');
        const keyName = document.createElement('span');
        keyBtn.setAttribute('class', 'remote__list__keyBtn');
        keyBtn.setAttribute('name', userKey[i]);
        keyName.setAttribute('class', 'remote__list__keyName')
        remoteList.append(keyBtn);
        keyBtn.append(keyName);
        keyName.innerHTML = userKey[i];
        keyBtn.addEventListener('click', btnSelect)

    }
}

function init() {
    remoteCreator();
}

if(section) {
    init();
}