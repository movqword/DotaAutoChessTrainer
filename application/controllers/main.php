<?php

class Main extends Controller {
	public function __construct() {
		$this->SetView("main_view");
		$this->SetModel("main_model");
		
		$this->GetView()->Push("role_data", $this->GetModel()->GetFileContent("static/data/roles.json"));
		$this->GetView()->Push("class_data", $this->GetModel()->GetFileContent("static/data/classes.json"));
		$this->GetView()->Push("hero_data", $this->GetModel()->GetFileContent("static/data/heroes.json"));
	}
	
	public function index() {
		$this->GetView()->Render();
	}
}

?>
