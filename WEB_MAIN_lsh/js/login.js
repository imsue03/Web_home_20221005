// 쿠키 저장 함수
function setCookie(name, value, days) {
    const date = new Date();
    if (days !== 0) {
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    } else {
        // 쿠키 삭제
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}
function getCookie(name) {
    var cookie = document.cookie;
    console.log("쿠키를 요청합니다.");
    if (cookie != "") {
        var cookie_array = cookie.split("; ");
        for ( var index in cookie_array) {
            var cookie_name = cookie_array[index].split("=");
            if (cookie_name[0] == "popupYN") {
                return cookie_name[1];
            }
        }
    }
    return ;
}
function init(){ // 로그인 폼에 쿠키에서 가져온 아이디 입력
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');
    let get_id = getCookie("id");
    if(get_id) {
    emailInput.value = get_id;
    idsave_check.checked = true;
    }
    session_check(); // 세션 유무 검사
}

document.addEventListener('DOMContentLoaded', function() {
    const check_input = () => {
        const loginForm = document.querySelector('#login_form');
        const loginBtn = document.querySelector('#login_btn');
        const emailInput = document.querySelector('#typeEmailX');
        const passwordInput = document.querySelector('#typePasswordX');
        const idsave_check = document.getElementById('idSaveCheck');

        alert('아이디, 패스워드를 체크합니다');

        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

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

        const hasSpecialChar = passwordValue.match(/[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/) !== null;
        if (!hasSpecialChar) {
            alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
            return false;
        }

        const hasUpperCase = passwordValue.match(/[A-Z]+/) !== null;
        const hasLowerCase = passwordValue.match(/[a-z]+/) !== null;
        if (!hasUpperCase || !hasLowerCase) {
            alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
            return false;
        }

        // check_xss 함수 호출 시 input 요소가 아닌 value 값만 전달
        const sanitizedEmail = check_xss(emailValue);
        const sanitizedPassword = check_xss(passwordValue);

        // check_xss 검사 실패 시 처리
        if (!sanitizedEmail) {
            return false;
        }

        if (!sanitizedPassword) {
            return false;
        }

        if(idsave_check.checked == true) {
            alert("쿠키를 저장합니다. 이메일: " + emailValue);
            setCookie("id", emailValue, 1); // 1일 저장
            alert("쿠키 값 :" + emailValue);
        }
        else {
            setCookie("id", "", 0); // 쿠키 삭제
        }

        console.log('이메일:', emailValue);
        console.log('비밀번호:', passwordValue);

        session_set(); // 세션 생성
        loginForm.submit();  // 최종 로그인 폼 제출
    };

    document.querySelector('#login_btn').addEventListener('click', check_input);
});

// check_xss 함수: 입력값을 DOMPurify로 검사
const check_xss = (inputValue) => {
    const DOMPurify = window.DOMPurify;
    const sanitizedInput = DOMPurify.sanitize(inputValue);
    if (sanitizedInput !== inputValue) {
        alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
        return false;
    }
    return sanitizedInput;
};

function session_del() {//세션 삭제
    if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_test");
        alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
    } else {
        alert("세션 스토리지 지원 x");
    }
}

function logout(){
    session_del(); // 세션 삭제
    location.href='../index.html';
}