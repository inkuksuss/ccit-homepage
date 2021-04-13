import axios from 'axios';


// Kakao
const javascriptKey = "b46510cb58e54a3169d015fb9e716618";

function dataTransform(user) {
    const form = document.createElement("form");
    form.action = "http://localhost:4000";
    form.method = "POST";
    
    const dataInput = document.createElement("input");
    dataInput.type = "hidden";
    dataInput.name = "user";
    dataInput.value = JSON.stringify(user);
    console.log(dataInput);
    
    form.appendChild(dataInput);
    document.body.appendChild(form);
    form.submit();    
}

const sendUser = async (user, email, token) => {
    try {
        await axios({
            url: `/api/${email}/kakao`,
            method: "POST",
            data: { user, token },
        });
    } catch(err) {
        console.log(err);
    }
}

window.Kakao.init(javascriptKey);
console.log(Kakao.isInitialized());

window.kakaoLogin = function () {
    const token = window.Kakao.Auth.getAccessToken()
    window.Kakao.Auth.login({
        throughTalk: false,
        success: function (res) {
            Kakao.API.request({
                url: '/v2/user/me', //계정 정보
                success: function (res) {
                    const { 
                        kakao_account: user,
                    } = res
                    user.host = 'kakao';
                    sendUser(user, user.email, token);
                    alert('로그인 성공');
                    // window.location.replace("http://localhost:4000");
                    dataTransform(user);
                },
                fail: function (err) {
                    console.log(err)
                    window.location.reload();
                },
            })
        },
        fail: function (err) {
            console.log(err)
            window.location.reload();
        },
    });
};

window.kakaoLogout = function () {
    if (Kakao.Auth.getAccessToken()) {
        window.Kakao.API.request({
            url: '/v1/user/unlink',
            success: function (response) {
                alert('로그아웃');    
            },
            fail: function (error) {
                console.log(error)
            },
        })
        window.Kakao.Auth.setAccessToken(undefined);
        const userinfoElem = document.querySelector('#userinfo') 
        if(userinfoElem) userinfoElem.value = ''
    }
};


