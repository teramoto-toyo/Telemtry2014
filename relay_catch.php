<?php
//var_dump($_POST);

	include_once ('./server_config_bluehost.php');
	
	date_default_timezone_set('Europe/Berlin');

	if (!($cn = mysql_pconnect($sql_server, $sql_user, $sql_pw))) { echo "db connect error1"; die; }
	if (!(mysql_select_db($sql_db))) { echo "db connect error2"; die; }
	
	$datetime = $_POST[0]['datetime'];
	$driver_index = $_POST[0]['driver_index'];
	$lap_distance = $_POST[0]['lap_distance'];
	$lap_number = $_POST[0]['lap_number'];
	$thr_pos_driver = $_POST[0]['Thr_pos_driver'];
	$gear = $_POST[0]['gear'];
	$steered_angle = $_POST[0]['steered_angle'];
	$engine_rpm = $_POST[0]['engine_rpm'];
	$fuel_used  = $_POST[0]['fuel_used'];
	$fuel_used_ecu = $_POST[0]['fuel_used_ecu'];
	$fuel_used_per_lap = $_POST[0]['fuel_used_per_lap'];
	$turbo_pres = $_POST[0]['turbo_pres'];
	$eng_temp = $_POST[0]['eng_temp'];
	$eng_oil_temp = $_POST[0]['eng_oil_temp'];
	$gbox_oil_temp = $_POST[0]['gbox_oil_temp'];
	$ambient_air_temp = $_POST[0]['ambient_air_temp'];
	$brake_temp_f = $_POST[0]['brake_temp_f'];
	$brake_temp_r = $_POST[0]['brake_temp_r'];
	$coolant_pressure = $_POST[0]['coolant_pressure'];
	$ground_speed = $_POST[0]['ground_speed'];
	$drive_speed = $_POST[0]['drive_speed'];
	$g_lat = $_POST[0]['g_lat'];
	$g_long = $_POST[0]['g_long'];
	$tyre_pres_fl = $_POST[0]['tyre_pres_fl'];
	$tyre_pres_fr = $_POST[0]['tyre_pres_fr'];
	$tyre_pres_rl = $_POST[0]['tyre_pres_rl'];
	$tyre_pres_rr = $_POST[0]['tyre_pres_rr'];
	$tyre_temp_fl_in = $_POST[0]['tyre_temp_fl_in'];
	$tyre_temp_fr_in = $_POST[0]['tyre_temp_fr_in'];
	$tyre_temp_rl_in = $_POST[0]['tyre_temp_rl_in'];
	$tyre_temp_rr_in = $_POST[0]['tyre_temp_rr_in'];
	$tyre_temp_fl_center = $_POST[0]['tyre_temp_fl_ce'];
	$tyre_temp_fr_center = $_POST[0]['tyre_temp_fr_ce'];
	$tyre_temp_rl_center = $_POST[0]['tyre_temp_rl_ce'];
	$tyre_temp_rr_center = $_POST[0]['tyre_temp_rr_ce'];
	$tyre_temp_fl_out = $_POST[0]['tyre_temp_fl_ot'];
	$tyre_temp_fr_out = $_POST[0]['tyre_temp_fr_ot'];
	$tyre_temp_rl_out = $_POST[0]['tyre_temp_rl_ot'];
	$tyre_temp_rr_out = $_POST[0]['tyre_temp_rr_ot'];
	$susp_force_fl = $_POST[0]['susp_force_fl'];
	$susp_force_fr = $_POST[0]['susp_force_fr'];
	$susp_force_rl = $_POST[0]['susp_force_rl'];
	$susp_force_rr = $_POST[0]['susp_force_rr'];
	$ride_height_fl = $_POST[0]['ride_height_fl'];
	$ride_height_fr = $_POST[0]['ride_height_fr'];
	$ride_height_rear = $_POST[0]['ride_height_rear'];
	$gps_latitude = $_POST[0]['gps_latitude'];
	$gps_longitude = $_POST[0]['gps_longitude'];
	$gps_heading = $_POST[0]['gps_heading'];
	$gps_speed = $_POST[0]['gps_speed'];
	$brake_pres_f = $_POST[0]['brake_pres_f'];
	$brake_pres_r = $_POST[0]['brake_pres_r'];
	
	$sql_telemetry = "insert into nur2014_telemetry (datetime, driver_index, lap_distance, lap_number, Thr_pos_driver, gear, steered_angle, engine_rpm, fuel_used, fuel_used_ecu, fuel_used_per_lap, turbo_pres, eng_temp, eng_oil_temp, gbox_oil_temp, ambient_air_temp, brake_temp_f, brake_temp_r, coolant_pressure, ground_speed, drive_speed, g_lat, g_long, tyre_pres_fl, tyre_pres_fr, tyre_pres_rl, tyre_pres_rr, tyre_temp_fl_in, tyre_temp_fr_in, tyre_temp_rl_in, tyre_temp_rr_in, tyre_temp_fl_center, tyre_temp_fr_center, tyre_temp_rl_center, tyre_temp_rr_center, tyre_temp_fl_out, tyre_temp_fr_out, tyre_temp_rl_out, tyre_temp_rr_out, susp_force_fl, susp_force_fr, susp_force_rl, susp_force_rr, ride_height_fl, ride_height_fr, ride_height_rear, gps_latitude, gps_longitude, gps_heading, gps_speed, brake_pres_f, brake_pres_r ) values ( '$datetime', '$driver_index', '$lap_distance', '$lap_number', '$thr_pos_driver', '$gear', '$steered_angle', '$engine_rpm', '$fuel_used', '$fuel_used_ecu', '$fuel_used_per_lap', '$turbo_pres', '$eng_temp', '$eng_oil_temp', '$gbox_oil_temp', '$ambient_air_temp', '$brake_temp_f', '$brake_temp_r', '$coolant_pressure', '$ground_speed', '$drive_speed', '$g_lat', '$g_long', '$tyre_pres_fl', '$tyre_pres_fr', '$tyre_pres_rl', '$tyre_pres_rr', '$tyre_temp_fl_in', '$tyre_temp_fr_in', '$tyre_temp_rl_in', '$tyre_temp_rr_in', '$tyre_temp_fl_center', '$tyre_temp_fr_center', '$tyre_temp_rl_center', '$tyre_temp_rr_center', '$tyre_temp_fl_out', '$tyre_temp_fr_out', '$tyre_temp_rl_out', '$tyre_temp_rr_out', '$susp_force_fl', '$susp_force_fr', '$susp_force_rl', '$susp_force_rr' , '$ride_height_fl', '$ride_height_fr', '$ride_height_rear', '$gps_latitude', '$gps_longitude', '$gps_heading', '$gps_speed', '$brake_pres_f', '$brake_pres_r')";
	
	if (!($rs = mysql_query($sql_telemetry))) { echo "db query error3"; die; }
	
	for($i= 0; $i < count($_POST[1]); $i++){
		$sction_index	= $_POST[1][$i]['section_index'];
		$lap_number		= $_POST[1][$i]['lap_number'];
		$driver_index	= $_POST[1][$i]['driver_index'];
		$section_name	= $_POST[1][$i]['section_name'];
		$start_v		= $_POST[1][$i]['start_v'];
		$end_v			= $_POST[1][$i]['end_v'];
		$in_section		= $_POST[1][$i]['in_section'];
		$max_speed		= $_POST[1][$i]['max_speed'];
		$max_speed_v	= $_POST[1][$i]['max_speed_v'];
		$min_speed		= $_POST[1][$i]['min_speed'];
		$min_speed_v	= $_POST[1][$i]['min_speed_v'];
		$max_g			= $_POST[1][$i]['max_g'];
		$max_g_v		= $_POST[1][$i]['max_g_v'];
		$tyre_temp_fl_in	= $_POST[1][$i]['tyre_temp_fl_in'];
		$tyre_temp_fr_in	= $_POST[1][$i]['tyre_temp_fr_in'];
		$tyre_temp_rl_in	= $_POST[1][$i]['tyre_temp_rl_in'];
		$tyre_temp_rr_in	= $_POST[1][$i]['tyre_temp_rr_in'];
		$tyre_temp_fl_ce	= $_POST[1][$i]['tyre_temp_fl_ce'];
		$tyre_temp_fr_ce	= $_POST[1][$i]['tyre_temp_fr_ce'];
		$tyre_temp_rl_ce	= $_POST[1][$i]['tyre_temp_rl_ce'];
		$tyre_temp_rr_ce	= $_POST[1][$i]['tyre_temp_rr_ce'];
		$tyre_temp_fl_ot	= $_POST[1][$i]['tyre_temp_fl_ot'];
		$tyre_temp_fr_ot	= $_POST[1][$i]['tyre_temp_fr_ot'];
		$tyre_temp_rl_ot	= $_POST[1][$i]['tyre_temp_rl_ot'];
		$tyre_temp_rr_ot	= $_POST[1][$i]['tyre_temp_rr_ot'];
		$tyre_press_fl	= $_POST[1][$i]['tyre_press_fl'];
		$tyre_press_fr	= $_POST[1][$i]['tyre_press_fr'];
		$tyre_press_rl	= $_POST[1][$i]['tyre_press_rl'];
		$tyre_press_rr	= $_POST[1][$i]['tyre_press_rr'];
		$datetime		= $_POST[1][$i]['datetime'];
	
		$sql_section = "insert into nur2014_section (section_index, lap_number, driver_index, section_name, start_v, end_v, in_section, max_speed, max_speed_v, min_speed, min_speed_v, max_g, max_g_v, tyre_temp_fl_in, tyre_temp_fr_in, tyre_temp_rl_in, tyre_temp_rr_in, tyre_temp_fl_ce, tyre_temp_fr_ce, tyre_temp_rl_ce, tyre_temp_rr_ce, tyre_temp_fl_ot, tyre_temp_fr_ot, tyre_temp_rl_ot, tyre_temp_rr_ot, tyre_press_fl, tyre_press_fr, tyre_press_rl, tyre_press_rr, datetime) values ( '$sction_index', '$lap_number', '$driver_index', '$section_name', '$start_v', '$end_v', '$in_section', '$max_speed', '$max_speed_v', '$min_speed', '$min_speed_v', '$max_g', '$max_g_v', '$tyre_temp_fl_in', '$tyre_temp_fr_in', '$tyre_temp_rl_in', '$tyre_temp_rr_in', '$tyre_temp_fl_ce', '$tyre_temp_fr_ce', '$tyre_temp_rl_ce', '$tyre_temp_rr_ce', '$tyre_temp_fl_ot', '$tyre_temp_fr_ot', '$tyre_temp_rl_ot', '$tyre_temp_rr_ot', '$tyre_press_fl', '$tyre_press_fr', '$tyre_press_rl', '$tyre_press_rr', '$datetime')";
		
		if (!($rs = mysql_query($sql_section))) { echo "db query error4"; die; }
	}
?>
