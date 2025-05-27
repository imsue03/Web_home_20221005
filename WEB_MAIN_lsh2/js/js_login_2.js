import { session_set, session_get, session_check } from './js_session.js';
import { encrypt_text, decrypt_text } from './js_crypto.js';
import { generateJWT, checkAuth } from './js_jwt_token.js';


function init() { // 로그인 폼에 쿠키에서 가져온 아이디 입력
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');
    const get_id = getCookie("id");
    if (get_id) {
        emailInput.value = get_id;
        idsave_check.checked = true;
    }
    session_check();
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    init_logined();
});


function init_logined() {
    if (sessionStorage) {
        decrypt_text(); // 복호화 함수
    } else {
        alert("세션 스토리지 지원 x");
    }
}

// 아마 login2는 여기 밑부턴 필요없음

const check_xss = (input) => {
    const DOMPurify = window.DOMPurify;
    const sanitizedInput = DOMPurify.sanitize(input);
    if (sanitizedInput !== input) {
        alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
        return false;
    }
    return sanitizedInput;
};

function setCookie(name, value, expiredays) {
    const date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie =
        encodeURIComponent(name) + "=" + encodeURIComponent(value) +
        "; expires=" + date.toUTCString() +
        "; path=/; SameSite=None; Secure";
}

function getCookie(name) {
    const cookie = document.cookie;
    console.log("쿠키를 요청합니다.");
    if (cookie !== "") {
        const cookie_array = cookie.split("; ");
        for (let index in cookie_array) {
            const cookie_name = cookie_array[index].split("=");
            if (cookie_name[0] === "id") {
                return cookie_name[1];
            }
        }
    }
    return;
}

function logout() {
    session_del(); // js_session.js에 정의됨
    location.href = '../index.html';
}

const check_input = () => {
    const loginForm = document.getElementById('login_form');
    const emailInput = document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');

    // 전역 변수 추가, 맨 위 위치
    const idsave_check = document.getElementById('idSaveCheck');

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const payload = {
      id: emailValue,
      exp: Math.floor(Date.now() / 1000) + 3600 // 1시간 (3600초)
    };
    const jwtToken = generateJWT(payload);

    alert('아이디, 패스워드를 체크합니다');

    const sanitizedEmail = check_xss(emailValue);
    const sanitizedPassword = check_xss(passwordValue);

    if (emailValue === '') {
        alert('이메일을 입력하세요.');
        return false;
    }

    if (passwordValue === '') {
        alert('비밀번호를 입력하세요.');
        return false;
    }

    if (emailValue.length < 5) {
        alert('아이디는 최소 5글자 이상 입력해야 합니다.');
        return false;
    }

    if (passwordValue.length < 12) {
        alert('비밀번호는 반드시 12글자 이상 입력해야 합니다.');
        return false;
    }

    const hasSpecialChar = /[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(passwordValue);
    if (!hasSpecialChar) {
        alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
        return false;
    }

    const hasUpperCase = /[A-Z]+/.test(passwordValue);
    const hasLowerCase = /[a-z]+/.test(passwordValue);
    if (!hasUpperCase || !hasLowerCase) {
        alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
        return false;
    }

    if (!sanitizedEmail || !sanitizedPassword) {
        return false;
    }

    if (idsave_check.checked) {
        alert("쿠키를 저장합니다: " + emailValue);
        setCookie("id", emailValue, 1);
        alert("쿠키 값 :" + emailValue);
    } else {
        setCookie("id", emailValue, 0);
    }

    console.log('이메일:', emailValue);
    console.log('비밀번호:', passwordValue);

    session_set(); // 세션 생성

    localStorage.setItem('jwt_token', jwtToken);

    loginForm.submit();
};

document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("login_btn");
    if (loginBtn) {
        loginBtn.addEventListener("click", function (event) {
            event.preventDefault();
            check_input();
        });
    }
});
