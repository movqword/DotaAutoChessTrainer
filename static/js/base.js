function ShowContent() {
	document.getElementsByTagName("body")[0].style.visibility = "visible";
	document.getElementsByTagName("body")[0].style.opacity = "1";
}

function SetCookie(name, value, days) {
    var expires = "";
	
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
	
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function GetCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
	
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
		
        while (c.charAt(0) == " ") {
			c = c.substring(1, c.length);
		}
		
        if (c.indexOf(nameEQ) == 0) {
			return c.substring(nameEQ.length, c.length);
		}
    }
	
    return null;
}

function RemoveCookie(name) {
	document.cookie = name + "=; Max-Age=-99999999;";  
}

function GetRootPath() {
	return window.location.protocol + "//" + window.location.host + "/";
}

function LoadFile(path, mime, callback) {
	var request = new XMLHttpRequest();
	
	request.overrideMimeType(mime);
	request.open("GET", path, true);
	
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == "200") {
            callback(request.responseText);
		}
    };
	
    request.send(null);  
}
