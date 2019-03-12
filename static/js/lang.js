var lang_data = null;

function SetLangId(id) {
	SetCookie("lang", id, 30);
	location.reload();
}

function GetLangText(lang_key) {
	return lang_data[lang_key];
}

document.addEventListener("DOMContentLoaded", function(event) {
	var lang_id = GetCookie("lang");
	
	if (lang_id == null) {
		lang_id = "en";
	}
	
	LoadFile(GetRootPath() + "static/data/lang/" + lang_id + ".json", "application/json", function(response) {
		lang_data = JSON.parse(response);
		
		var elements = document.querySelectorAll("[lang_key]");
		
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			var lang_key = element.getAttribute("lang_key");
			
			element.innerHTML = lang_data[lang_key];
			element.removeAttribute("lang_key");
		}
		
		ShowContent();
		document.dispatchEvent(new Event("LangLoaded"));
	});	
});
