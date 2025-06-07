
// 회원가입 정보 암호화 및 세션 저장
function registerUser(username, password) {
    const userInfo = {
        username: username,
        password: btoa(password) // 간단한 base64 암호화
    };
    sessionStorage.setItem("user_session", JSON.stringify(userInfo));
    console.log("회원가입 정보가 암호화되어 저장되었습니다.");
}

// 로그인 후 복호화 및 출력
function displayDecryptedUser() {
    const session = sessionStorage.getItem("user_session");
    if (!session) {
        console.log("세션에 저장된 회원가입 정보가 없습니다.");
        return;
    }
    const user = JSON.parse(session);
    const decrypted = {
        username: user.username,
        password: atob(user.password) // 복호화
    };
    console.log("복호화된 회원 정보:", decrypted);
}
