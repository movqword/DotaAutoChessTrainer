<?php

session_start(); 

define("ROOT_DIR", realpath(dirname(__FILE__)) . "/");
define("APP_DIR", ROOT_DIR . "application/");

require(APP_DIR . "config/config.php");
require(ROOT_DIR . "system/model.php");
require(ROOT_DIR . "system/view.php");
require(ROOT_DIR . "system/controller.php");

global $config;
define("BASE_URL", $config["base_url"]);

$controller = $config["default_controller"];
$action = "index";
$url = "";

$request_url = isset($_SERVER["REQUEST_URI"]) ? $_SERVER["REQUEST_URI"] : "";
$script_url = isset($_SERVER["PHP_SELF"]) ? $_SERVER["PHP_SELF"] : "";

if ($request_url != $script_url) {
	$url = trim(preg_replace("/" . str_replace("/", "\/", str_replace("index.php", "", $script_url)) . "/", "", $request_url, 1), "/");
}

if (strpos($url, "index.html") !== false) {
	$url = str_replace("index.html", "", $url);
	exit(header("Location: " . $config["base_url"] . $url));
}

$segments = explode("/", $url);

if (isset($segments[0]) && $segments[0] != "" && $segments[0][0] != "?") {
	$controller = $segments[0];
}

if (isset($segments[1]) && $segments[1] != "" && $segments[1][0] != "?") {
	$action = $segments[1];
}

$path = APP_DIR . "controllers/" . $controller . ".php";

if (file_exists($path)) {
	require_once($path);
} else {
    $controller = $config["error_controller"];
    require_once(APP_DIR . "controllers/" . $controller . ".php");
}

if (!method_exists($controller, $action)) {
    $controller = $config["error_controller"];
    require_once(APP_DIR . "controllers/" . $controller . ".php");
    $action = "index";
}

die(call_user_func_array(array(new $controller, $action), array_slice($segments, 2)));

?>
