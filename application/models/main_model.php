<?php

class MainModel extends Model {
	public function GetFileContent($file_path) {
		return file_get_contents($file_path);
	}
}

?>
