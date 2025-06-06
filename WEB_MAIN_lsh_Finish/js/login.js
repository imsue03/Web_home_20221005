
// 로그인 실패 카운트 및 쿠키 처리
function login_failed() {
    let failCount = parseInt(getCookie("login_fail_count") || "0");
    failCount += 1;
    setCookie("login_fail_count", failCount, 1);

    if (failCount >= 3) {
        alert("로그인 시도가 3회 이상 실패하여 제한되었습니다.");
    } else {
        alert("로그인 실패. 현재 실패 횟수: " + failCount);
    }

    document.getElementById("login-status").innerText = 
        "실패 횟수: " + failCount + 
        (failCount >= 3 ? " (로그인 제한)" : "");
}

// 쿠키 설정 함수
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    document.cookie = name + "=" + value + ";expires=" + d.toUTCString() + ";path=/";
}

// 쿠키 가져오기 함수
function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(cname) === 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

// 로그아웃 기능: 로컬스토리지 토큰 삭제
function logout() {
    localStorage.removeItem("jwt_token");
    alert("로그아웃 되었습니다.");
}
