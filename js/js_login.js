import { session_set, session_get, session_check } from './js_session.js';
import { encrypt_text, decrypt_text } from './js_crypto.js';
import { generateJWT, checkAuth } from './js_jwt_token.js';

// 페이지 로딩 시 실행되는 초기화 함수
function init() {
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
    init();
});

// 로그인 후 사용자 정보 복호화
function init_logined() {
    if (sessionStorage) {
        decrypt_text(); // 복호화 함수
    } else {
        alert("세션 스토리지 지원 x");
    }
}

// XSS 방지를 위한 입력값 필터링 함수
const check_xss = (input) => {
    const DOMPurify = window.DOMPurify;
    const sanitizedInput = DOMPurify.sanitize(input);
    if (sanitizedInput !== input) {
        alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
        return false;
    }
    return sanitizedInput;
};

// 쿠키 설정 함수
function setCookie(name, value, expiredays) {
    const date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie =
        encodeURIComponent(name) + "=" + encodeURIComponent(value) +
        "; expires=" + date.toUTCString() +
        "; path=/; SameSite=None; Secure";
}

// 쿠키 조회 함수
function getCookie(name) {
    const cookie = document.cookie;
    if (cookie !== "") {
        const cookie_array = cookie.split("; ");
        for (let index in cookie_array) {
            const cookie_name = cookie_array[index].split("=");
            if (cookie_name[0] === name) {
                return cookie_name[1];
            }
        }
    }
    return;
}

// 🔹 로그인 실패 시 호출되는 함수 (실패 횟수 카운트 및 차단)
function login_failed() {
    let failedCount = parseInt(getCookie("login_failed")) || 0;
    failedCount++;

    // 3회 이상 실패 시 차단
    if (failedCount >= 3) {
        alert(`로그인이 ${failedCount}회 실패하여 차단되었습니다.`);
        setCookie("login_failed", failedCount, 1);
        return false;
    }

    setCookie("login_failed", failedCount, 1);
    alert(`로그인 실패 횟수: ${failedCount}`);
    return true;
}

// 로그아웃 시 세션 제거 및 이동
function logout() {
    session_del(); // js_session.js에 정의됨
    location.href = '../index.html';
}

// 로그인 입력값 검증 및 처리
const check_input = () => {
    const loginForm = document.getElementById('login_form');
    const emailInput = document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');
    const idsave_check = document.getElementById('idSaveCheck');

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const payload = {
        id: emailValue,
        exp: Math.floor(Date.now() / 1000) + 3600 // 1시간
    };

    const jwtToken = generateJWT(payload);
    alert('아이디, 패스워드를 체크합니다');

    const sanitizedEmail = check_xss(emailValue);
    const sanitizedPassword = check_xss(passwordValue);

    if (emailValue === '') {
        alert('이메일을 입력하세요.');
        login_failed(); // 🔹 실패 기록
        return false;
    }

    if (passwordValue === '') {
        alert('비밀번호를 입력하세요.');
        login_failed(); // 🔹 실패 기록
        return false;
    }

    if (emailValue.length < 5) {
        alert('아이디는 최소 5글자 이상 입력해야 합니다.');
        login_failed(); // 🔹 실패 기록
        return false;
    }

    if (passwordValue.length < 12) {
        alert('비밀번호는 반드시 12글자 이상 입력해야 합니다.');
        login_failed(); // 🔹 실패 기록
        return false;
    }

    const hasSpecialChar = /[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(passwordValue);
    if (!hasSpecialChar) {
        alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
        login_failed(); // 🔹 실패 기록
        return false;
    }

    const hasUpperCase = /[A-Z]+/.test(passwordValue);
    const hasLowerCase = /[a-z]+/.test(passwordValue);
    if (!hasUpperCase || !hasLowerCase) {
        alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
        login_failed(); // 🔹 실패 기록
        return false;
    }

    if (!sanitizedEmail || !sanitizedPassword) {
        login_failed(); // 🔹 실패 기록
        return false;
    }

    const failedCount = parseInt(getCookie("login_failed")) || 0;
    if (failedCount >= 3) {
        alert("3회 이상 로그인에 실패하여 계정이 잠겼습니다.");
        return false;
    }

    // 아이디 저장 여부에 따른 쿠키 설정
    if (idsave_check.checked) {
        alert("쿠키를 저장합니다: " + emailValue);
        setCookie("id", emailValue, 1);
    } else {
        setCookie("id", emailValue, 0);
    }

    session_set(); // 세션 생성
    localStorage.setItem('jwt_token', jwtToken);

    // 로그인 성공 시 실패 카운트 초기화
    setCookie("login_failed", 0, 0); // 🔹 성공하면 초기화

    loginForm.submit();
};

// DOM 로딩 완료 후 로그인 버튼 이벤트 등록
document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("login_btn");
    if (loginBtn) {
        loginBtn.addEventListener("click", function (event) {
            event.preventDefault();
            check_input();
        });
    }
});

