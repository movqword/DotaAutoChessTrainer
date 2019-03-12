<?php

class View {
	private $template = null;
	private $data = array();

	public function __construct($template) {
		$this->template = APP_DIR . "views/" . $template . ".php";
	}
	
	public function Push($name, $value) {
		$this->data[$name] = $value;
	}

	public function Render() {
		extract($this->data);
		
		ob_start();
		require($this->template);
		echo(ob_get_clean());
	}
}

?>
