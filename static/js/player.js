var player_name = "";
var player_id = "";
var player_level = 0;
var player_score = 0;
var player_match = 0;
var player_data = null;

function UpdatePlayer() {
	if (player_name == "" || player_data == null) {
		return;
	}
	
	var icon_el = document.getElementById("player_icon");
	icon_el.src = GetRootPath() + "static/images/player_icons/" + player_data.onduty_hero.split("_")[0] + ".png";

	var name_el = document.getElementById("player_name");
	name_el.innerHTML = player_name;
	
	var rank_el = document.getElementById("player_rank");
	rank_el.innerHTML = GetLangText("player_level_" + player_level) + " (" + player_score + " MMR)";

	var matches_el = document.getElementById("player_matches");
	matches_el.innerHTML = player_match;
	
	var candy_el = document.getElementById("player_candy");
	candy_el.innerHTML = player_data.candy;
	
	var couriers_grid_el = document.getElementById("couriers_grid");
	
	for (var i = 0; i < player_data.zhugong.length; i++) {
		var courier_el = document.createElement("img");
		courier_el.className = "courier_icon";
		courier_el.src = GetRootPath() + "static/images/player_icons/" + player_data.zhugong[i].split("_")[0] + ".png";
		
		couriers_grid_el.appendChild(courier_el);
	}
	
	UpdateShareLink();
}

function ClearPlayer(loading = false) {
	var icon_el = document.getElementById("player_icon");
	
	if (loading) {
		icon_el.src = GetRootPath() + "static/images/loading.gif";
	}
	else {
		icon_el.src = GetRootPath() + "static/images/player_icons/" + player_data.onduty_hero.split("_")[0] + ".png";
	}
	
	var name_el = document.getElementById("player_name");
	name_el.innerHTML = "";
	
	var rank_el = document.getElementById("player_rank");
	rank_el.innerHTML = "";

	var matches_el = document.getElementById("player_matches");
	matches_el.innerHTML = "";
	
	var candy_el = document.getElementById("player_candy");
	candy_el.innerHTML = "";
	
	var couriers_grid_el = document.getElementById("couriers_grid");
	couriers_grid_el.innerHTML = "";
	
	UpdateShareLink();
}

function ValidatePlayer(id = "") {
	var find_id = document.getElementById("find_id").value;
	
	if (id != "") {
		find_id = id;
	}
	
	find_id = ResolveId(find_id);
	
	var request = new XMLHttpRequest();
	
	request.open("GET", GetRootPath() + "player/validate/?id=" + find_id, true);
	request.send();
	
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == "200") {
			var json_answer = JSON.parse(request.responseText);
			
			player_name = json_answer.response.players[0].personaname;
			player_id = find_id;
			
            UpdatePlayer();
		}
		else {
			var icon_el = document.getElementById("player_icon");
			icon_el.src = GetRootPath() + "static/images/error.png";
			
			var name_el = document.getElementById("player_name");
			name_el.innerHTML = "NOT FOUND";
		}
    };
}

function RankPlayer(id = "") {
	var find_id = document.getElementById("find_id").value;
	
	if (id != "") {
		find_id = id;
	}
	
	if (find_id == "" || find_id == null) {
		return;
	}
	
	find_id = ResolveId(find_id);
	
	var request = new XMLHttpRequest();
	
	request.open("GET", GetRootPath() + "player/rank/?id=" + find_id, true);
	request.send();
	
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == "200") {
			var json_answer = JSON.parse(request.responseText);
			
			player_level = json_answer.ranking_info[0].mmr_level;
            player_score = json_answer.ranking_info[0].score;
			player_match = json_answer.ranking_info[0].match;
			
			ValidatePlayer(id);
		}
    };
}

function FindPlayer(id = "") {
	var find_id = document.getElementById("find_id").value;
	
	if (id != "") {
		find_id = id;
	}
	
	if (find_id == "" || find_id == null) {
		return;
	}
	
	find_id = ResolveId(find_id);

	ClearPlayer(true);
	
	var request = new XMLHttpRequest();
	
	request.open("GET", GetRootPath() + "player/find/?id=" + find_id, true);
	request.send();
	
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == "200") {
			var json_answer = JSON.parse(request.responseText);
			
			player_data = json_answer.user_info;
            
			RankPlayer(id);
		}
    };
}

function PutPlayer(id) {
	document.getElementById("find_id").value = id;
	FindPlayer();
}

function UpdateShareLink() {
    var share_link_el = document.getElementById("share_link");
    share_link_el.innerHTML = window.location.protocol + "//" + window.location.host + "/player/?id=" + player_id;
}

function ResolveId(id) {
	var find_id = new Big(id);
	
	if (find_id < 76561197960265728) {
		find_id = find_id.plus("76561197960265728");
	}
	
	return find_id.toString();
}

document.addEventListener("LangLoaded", function (event) {
    var url = new URL(window.location.href);
    var find_id = url.searchParams.get("id");

    if (find_id != null && find_id != "") {
        FindPlayer(find_id);
    }
});
