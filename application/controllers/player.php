<?php

class Player extends Controller {
	function __construct() {
		$this->SetView("player_view");
	}
	
	function index() {
		$this->GetView()->Render();
	}
	
	function find() {
		echo(file_get_contents("http://autochess.ppbizon.com/shop/get/@" . $_GET["id"]));
	}
	
	function rank() {
		ini_set("user_agent", "Valve/Steam HTTP Client 1.0 (570;Windows;tenfoot)");
		echo(file_get_contents("http://autochess.ppbizon.com/ranking/get?player_ids=" . $_GET["id"] . "&myself=" . $_GET["id"]));
	}
	
	function validate() {
		echo(file_get_contents("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=9769949E852C17956728D82F74CDF634&steamids=" . $_GET["id"]));
	}
}

?>
