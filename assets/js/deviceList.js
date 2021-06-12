const listBox = document.querySelector('.user-device-list');
const keyList = document.querySelector('.user-device-key');

const listCreator = () => {
    const userKeyList = JSON.parse(keyList.value);
    const userKey = userKeyList.key;
    for (let i = 0; i < userKey.length; i++) {
        const device = document.createElement('div');
        const link = document.createElement('a');
        const span = document.createElement('span');
        listBox.append(device);
        device.append(link);
        link.append(span);
        link.setAttribute('href','#')
        span.innerHTML = userKey[i]
    }
}

function init() {
    listCreator()
}

if(listBox) {
    init();
};
