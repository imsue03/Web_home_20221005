document.getElementById("search_btn").addEventListener('click', search_message);

function search_message() {
    alert("검색을 수행합니다!");
}

function googleSearch() {
    const searchTerm = document.getElementById("search_input").value.trim(); // 양쪽 공백 제거

    // 1. 공백 검사
    if (searchTerm.length === 0) {
        alert("검색어를 입력하세요.");
        return false;
    }

    // 2. 비속어 검사
    const bannedWords = ["바보", "멍청이", "욕설1", "욕설2", "등등"]; // 비속어 리스트
    for (let word of bannedWords) {
        if (searchTerm.includes(word)) {
            alert("부적절한 단어가 포함되어 있어 검색할 수 없습니다.");
            return false;
        }
    }

    // 통과 시 구글 검색 수행
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    window.open(googleSearchUrl, "_blank");
    return false;
}