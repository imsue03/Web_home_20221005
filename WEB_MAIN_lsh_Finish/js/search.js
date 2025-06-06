
// search_message 함수 1 - 중복 함수 테스트용
function search_message() {
    console.log("첫 번째 search_message 함수");
}

// search_message 함수 2 - 중복 함수
function search_message() {
    let message = "검색을 수행합니다";
    console.log(message);
}

// googleSearch 함수 수정
function googleSearch() {
    let badWords = ["욕", "비속어", "금지"];
    let input = document.getElementById("search-input").value.trim();

    if (input.length === 0) {
        alert("검색어를 입력하세요.");
        return;
    }

    for (let i = 0; i < badWords.length; i++) {
        if (input.includes(badWords[i])) {
            alert("비속어가 포함되어 있습니다.");
            return;
        }
    }

    let query = "https://www.google.com/search?q=" + encodeURIComponent(input);
    window.open(query, "_blank");
}
