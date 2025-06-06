import { encrypt_text, decrypt_text } from './js_crypto.js';

export function session_set(){ //세션 저장(객체)
    let id = document.querySelector("#typeEmailX");
    let password = document.querySelector("#typePasswordX");
    let random = new Date(); // 랜덤 타임스탬프

    const obj = { // 객체 선언
    id : id.value,
    otp : random
    }

    if (sessionStorage) {
        const objString = JSON.stringify(obj); // 객체 -> JSON 문자열 변환
        let en_text = //await 
        encrypt_text(objString); // 암호화
    
        sessionStorage.setItem("Session_Storage_id", id.value);
        sessionStorage.setItem("Session_Storage_object", objString);
        sessionStorage.setItem("Session_Storage_pass", en_text);
        } else {
            alert("세션 스토리지 지원 x");
        }
}


export function session_get() { // 세션 읽기
    if (sessionStorage) {
        return sessionStorage.getItem("Session_Storage_pass");
    } else {
        alert("세션 스토리지 지원 x");
    }
}

export function session_check() { // 세션 검사
    if (sessionStorage.getItem("Session_Storage_id")) {
        alert("이미 로그인 되었습니다.");
        location.href = '../login/index_login.html';
    }
}

function session_del() { // 세션 삭제
    if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_id");
        sessionStorage.removeItem("Session_Storage_pass");
        alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
    } else {
        alert("세션 스토리지 지원 x");
    }
}

export async function session_set2(obj) {
    if (!obj || typeof obj !== 'object') {
        console.error("유효한 객체가 전달되지 않았습니다.");
        return;
    }

    if (sessionStorage) {
        const objString = JSON.stringify(obj);              // 객체 → JSON
        // const en_text = await encrypt_text(objString);       // 암호화

        sessionStorage.setItem("Session_Storage_object", objString);
        // sessionStorage.setItem("Session_Storage_encrypted", en_text);
    } else {
        alert("세션 스토리지 지원 x");
    }
}