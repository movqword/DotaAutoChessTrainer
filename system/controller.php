<?php

class Controller {
	private $model = null;
	private $view = null;
	
	public function SetModel($name) {
		require(APP_DIR . "models/". strtolower($name) . ".php");
		$name = str_replace("_", "", $name);
		$this->model = new $name;
	}
	
	public function GetModel() {
		return $this->model;
	}
	
	public function SetView($name) {
		$this->view = new View($name);
	}
	
	public function GetView() {
		return $this->view;
	}
}

?>
