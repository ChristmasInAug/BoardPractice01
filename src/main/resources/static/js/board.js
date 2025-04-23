console.log("✅ JS 파일 정상 연결됨");
let currentPage = 1;
const pageSize = 15;
let allBoards = []; // 전체 게시글 데이터를 여기에 저장

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOMContentLoaded 실행됨");
    const isIndexPage = document.getElementById("board-list-body") !== null;
    const isReadPage = document.getElementById("board-title") !== null;
    const isInsertPage = document.querySelector("form.post-form") !== null && window.location.pathname.includes("insert_page.html");
    console.log("✅ isInsertPage 여부:", isInsertPage);
    //const isUpdatePage = document.getElementById("post-id") !== null;
    const isUpdatePage = document.querySelector("form.post-form") !== null && window.location.pathname.includes("update_page.html");
    console.log("isUpdatePost 여부", isUpdatePage);

    if (isIndexPage) {
        fetchBoardList(); // 목록 불러오기

        const prevBtn = document.getElementById("prev-btn");
        const nextBtn = document.getElementById("next-btn");

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener("click", function () {
                if (currentPage > 1) {
                    currentPage--;
                    renderBoardPage(currentPage);
                }
            });

            nextBtn.addEventListener("click", function () {
                const totalPages = Math.ceil(allBoards.length / pageSize);
                if (currentPage < totalPages) {
                    currentPage++;
                    renderBoardPage(currentPage);
                }
            });
        }
    }

    if (isReadPage) {
        getReadBoard(); // 게시글 상세 불러오기
    }

    if (isInsertPage) { 
        initInsertPost(); // 게시글 작성하기
    }

    if (isUpdatePage){
        initUpdatePost();
    }
});

function fetchBoardList() {
    fetch("/api/boardlist")
        .then(response => {
            if (!response.ok) {
                throw new Error("서버 응답 오류");
            }
            return response.json();
        })
        .then(data => {
            console.log("받은 데이터 : ", data);
            data.sort((a,b) => new Date(b.createdAt) - new Date (a.createdAt));
            allBoards = data;              // 전역 배열에 저장
            renderBoardPage(currentPage);  // 첫 페이지 그리기
        })
        .catch(error => {
            console.error("게시글 불러오기 실패:", error);
        });
}
function renderBoardPage(page) {
    const tbody = document.getElementById("board-list-body");
    tbody.innerHTML = "";  // 기존 목록 초기화

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedBoards = allBoards.slice(startIndex, endIndex);

    paginatedBoards.forEach(board => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${board.id}</td>
            <td><a href="read_page.html?id=${board.id}">${board.title}</a></td>
            <td>${board.writer}</td>
            <td>${formatDate(board.createdAt)}</td>
            <td>${board.viewCount}</td>
        `;
        tbody.appendChild(tr);
    });

    // 페이지 정보 업데이트
    const totalPages = Math.ceil(allBoards.length / pageSize);
    document.getElementById("pagination-info").textContent = `${page} page / ${totalPages} pages`;

    // 버튼 활성/비활성 처리
    document.getElementById("prev-btn").disabled = page <= 1;
    document.getElementById("next-btn").disabled = page >= totalPages;
}


// 날짜 포맷 변환 함수 (예: 2025-04-07)
function formatDate(datetime) {
    if (!datetime) return "";
    return datetime.split("T")[0];
}


function getReadBoardIdFromURL(){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}


function getReadBoard() {
    const boardId = getReadBoardIdFromURL();

    if(!boardId) {
        alert("잘못된 접근입니다.")
        return;
    };

    // ✅ 조회수 증가 먼저 요청
    fetch(`/api/board/viewcount/${boardId}`, {
        method: "PUT"
    })
    .then(() => {
        // ✅ 게시글 상세 조회
        return fetch(`/api/board/${boardId}`);
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("서버 응답 오류");
        }
        return response.json();
    })
    .then(board => {
        readPageBoardDetail(board);
    })
    .catch(error => {
        console.error("게시글 조회 실패:", error);
    });

    /*
    fetch(`/api/board/${boardId}`)
        .then(response => {
            if (!response.ok){
                throw new Error("서버 응답 오류");
            }
            return response.json();
        })
        .then(board => {
            readPageBoardDetail(board);
        })
        .catch(error => {
            console.error("게시글 조회 실패 :", error);
        })
            */
}

function readPageBoardDetail(board) {
    console.log("데이터 확인:", board); 
    console.log("타이틀 요소:", document.getElementById("board-title")); 
    document.getElementById("board-title").textContent = board.title;
    document.getElementById("board-writer").textContent = board.writer;
    document.getElementById("board-createdAt").textContent = formatDate(board.createdAt);
    document.getElementById("board-viewCount").textContent = board.viewCount;
    document.getElementById("board-content").textContent = board.content;

     // ✅ 수정 버튼 링크 동적으로 설정
     const editBtn = document.querySelector(".edit-btn");
     editBtn.href = `update_page.html?id=${board.id}`;

     // ✅ 삭제 버튼 클릭 이벤트
    const deleteBtn = document.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", function () {
        const confirmed = confirm("정말 삭제하시겠습니까?");
        if (!confirmed) return;

        fetch(`/api/delete/${board.id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) throw new Error("삭제 실패");
            return response.text();
        })
        .then(message => {
            alert(message);
            window.location.href = "index.html"; // 삭제 후 목록 페이지로 이동
        })
        .catch(error => {
            console.error("삭제 실패:", error);
            alert("삭제에 실패했습니다.");
        });
    });
}


function initInsertPost() {
    console.log("📌 글쓰기 JS initInsertPost 실행됨");
    const form = document.querySelector("form.post-form");
    console.log("✅ initInsertPost 내부의 form:", form);

    setupLiveValidation();

    form.addEventListener("submit", function (e) {
        console.log("📌 글쓰기 submit 이벤트 핸들러 진입");
        e.preventDefault(); // 기본 submit 막기
        console.log("📌 글쓰기 JS submit 작동 여부");

        const writer = document.getElementById("name").value.trim();
        const title = document.getElementById("title").value.trim();
        const content = document.getElementById("content").value.trim();

        if (writer.length > 20) {
            alert("작성자는 20자 이내로 입력해주세요.");
            return;
          }
          if (title.length > 30) {
            alert("제목은 30자 이내로 입력해주세요.");
            return;
          }

        const postData = {
            writer: writer,
            title: title,
            content: content
        };

        fetch("/api/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("서버 응답 오류");
            }
            return response.json();
        })
        .then(data => {
            alert("글이 성공적으로 등록되었습니다.");
            window.location.href = "index.html";
        })
        .catch(error => {
            console.error("글 작성 실패:", error);
            alert("글 작성에 실패했습니다.");
        });
        console.log("📌 글쓰기 JS 실행됨");
    });
}

function initUpdatePost() {
    console.log("✏️ 글수정 JS initUpdatePost 실행됨");

    const form = document.querySelector("form.post-form");

    setupLiveValidation();

    // ✅ URL에서 ID 가져오기
    const postId = getReadBoardIdFromURL();
    console.log("✅ 수정용 postId:", postId);
    if (!postId) {
        alert("잘못된 접근입니다.");
        return;
    }

    // ✅ 기존 게시글 데이터 조회 → input에 채워넣기
    fetch(`/api/board/${postId}`)
        .then(response => {
            if (!response.ok) throw new Error("게시글 불러오기 실패");
            return response.json();
        })
        .then(board => {
            document.getElementById("post-id").value = board.id;
            document.getElementById("name").value = board.writer;
            document.getElementById("title").value = board.title;
            document.getElementById("content").value = board.content;
        })
        .catch(error => {
            console.error("게시글 불러오기 실패:", error);
        });

    // ✅ 수정 저장 이벤트
    form.addEventListener("submit", function (e) {
        console.log("📌 수정 submit 이벤트 핸들러 진입");
        e.preventDefault();

        const id = document.getElementById("post-id").value;
        const writer = document.getElementById("name").value.trim();
        const title = document.getElementById("title").value.trim();
        const content = document.getElementById("content").value.trim();

        if (writer.length > 20) {
            alert("작성자는 20자 이내로 입력해주세요.");
            return;
          }
          if (title.length > 30) {
            alert("제목은 30자 이내로 입력해주세요.");
            return;
          }

        const updatedPostData = {
            writer: writer,
            title: title,
            content: content
        };

        fetch(`/api/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedPostData)
        })
        .then(response => {
            if (!response.ok) throw new Error("수정 실패!");
            return response.json();
        })
        .then(data => {
            alert("게시글이 수정되었습니다!");
            window.location.href = `read_page.html?id=${id}`;
        })
        .catch(error => {
            console.error("글 수정 실패:", error);
            alert("글 수정에 실패했습니다.");
        });
    });

    // ✅ 취소 버튼 동작 연결
        const cancelBtn = document.getElementById("cancel-btn");
        console.log("✅ cancelBtn 찾은 결과:", cancelBtn);
        cancelBtn.addEventListener("click", function () {
            console.log("✅ 취소 버튼 클릭됨!");
            window.location.href = `read_page.html?id=${postId}`;
        });
}

// 실시간 글자 수 제한 함수
function setupLiveValidation() {
    const writerInput = document.getElementById("name");
    const titleInput = document.getElementById("title");

    writerInput.addEventListener("input", function () {
        if (writerInput.value.length > 20) {
            alert("작성자는 20자 이내로 입력해주세요.");
            writerInput.value = writerInput.value.slice(0, 20); // 초과된 글자 잘라내기
        }
    });

    titleInput.addEventListener("input", function () {
        if (titleInput.value.length > 30) {
            alert("제목은 30자 이내로 입력해주세요.");
            titleInput.value = titleInput.value.slice(0, 30); // 초과된 글자 잘라내기
        }
    });
}
