import routes from '../../routes';

const productBox = document.querySelector('.product__box')
const loggedUserInput = document.getElementById('jsUserInfo');

const userInfoFunc = () => {
    const jsLoggedUser = JSON.parse(loggedUserInput.value);
    console.log(jsLoggedUser)
    const userKey = jsLoggedUser.key;
    const userProudct = jsLoggedUser.product;
    console.log(userProudct)
    for(let i = 0; i < userKey.length; i++) {
        const box = document.createElement('div');
        const link = document.createElement('a');
        const h1 = document.createElement('h1');
        const img = document.createElement('img');
        productBox.append(box);
        box.append(link);
        link.append(h1, img);
        link.setAttribute('href', `${routes.productDetail(userProudct[i])}`)
        img.setAttribute('src', '/uploads/boards/avatar/47e4dbd63a33ebb06c8d0c654f54babd')
        h1.innerHTML = userKey[i];
    }
}

function init() {
    userInfoFunc();    
}

if(productBox) {
    init();
}