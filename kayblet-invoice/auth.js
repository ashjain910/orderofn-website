$(document).ready(function () {

    var userId = getCookie("userId");
    var sessionExpiration = getCookie("sessionExpiration");
    console.log(sessionExpiration && new Date().getTime() > parseInt(sessionExpiration))

    if (!userId || (sessionExpiration && new Date().getTime() > parseInt(sessionExpiration))) {
        var path = window.location.pathname;
        var page = path.split("/").pop();
        if (page != "index.html") {
            window.location.href = 'index.html';
        }
        setCookie("sessionExpiration", new Date().getTime() + (30 * 24 * 60 * 60 * 1000), 30);
    }
});

function setCookie(name, value, expirationDays) {
    var d = new Date();
    d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    var cookieArr = document.cookie.split(';');
    for (var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        if (name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}
