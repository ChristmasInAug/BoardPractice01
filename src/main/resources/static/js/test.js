function testConnection() {
    fetch ('api/test')
    .then(response => response.text())
    .then(data => {
        alert ('서버 응답: ' + data);
    })
    .catch(error => {
        alert ('에러 발생:' + error);
    });
}