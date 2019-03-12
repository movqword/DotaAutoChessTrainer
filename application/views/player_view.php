<?php include("base_header_view.php"); ?>

<script src="<?php echo(BASE_URL); ?>static/js/big.js"></script>
<script src="<?php echo(BASE_URL); ?>static/js/player.js"></script>

<h1 lang_key="player_finder_title"></h1>
<h3 lang_key="player_finder_note"></h3>
<h4 lang_key="player_finder_description"></h4>
<center><input id="find_id" name="find_id" type="text" class="find_input"></input>
<button class="find_button" onclick="FindPlayer()" lang_key="player_finder_button"></button></center>

<h1 lang_key="player_info_title"></h1>
<div class="player_content">
	<div class="player_card">
		<img id="player_icon" class="player_icon" src="<?php echo(BASE_URL); ?>static/images/player_icons/h001.png"></img>
		<div lang_key="player_info_name"></div>
		<div lang_key="player_info_rank"></div>
		<div lang_key="player_info_match"></div>
		<div lang_key="player_info_candy"></div>
	</div>
</div>

<div id="couriers_grid" class="couriers_content">
</div>

<h1 lang_key="share_title"></h1>
<center><textarea id="share_link" class="share_link_area" onfocus="this.select()" readonly></textarea></center>

<?php include("base_footer_view.php"); ?>