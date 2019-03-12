<?php include("base_header_view.php"); ?>

<script>
	var role_data = <?php echo($role_data); ?>;
	var class_data = <?php echo($class_data); ?>;
	var hero_data = <?php echo($hero_data); ?>;
</script>

<script src="<?php echo(BASE_URL); ?>static/js/main.js"></script>

<h1 lang_key="hero_picker_title"></h1>
<h3 lang_key="hero_picker_note"></h3>
<h4 lang_key="hero_picker_description"></h4>
<div id="hero_picker" class="hero_picker_content"></div>
<h3 lang_key="hero_picker_filter_note"></h3>
<h4 lang_key="hero_picker_filter_description"></h4>
<div id="hero_picker_filter" class="hero_picker_filter_content"></div>

<h1 lang_key="battleground_title"></h1>
<div class="battleground_content">
	<h2 lang_key="battleground_self_board"></h2>
	<h2 lang_key="battleground_enemy_board"></h2>
	<div id="battleground_board_self" class="battleground_board self"></div>
	<div id="battleground_board_enemy" class="battleground_board enemy"></div>
	<div id="battleground_combo_self" class="battleground_combo"></div>
	<div id="battleground_combo_enemy" class="battleground_combo"></div>
</div>
				
<h1 lang_key="share_title"></h1>
<center><textarea id="share_link" class="share_link_area" onfocus="this.select()" readonly></textarea></center>

<?php include("base_footer_view.php"); ?>