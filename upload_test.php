<?php
	include_once ('./server_config.php');
	
	function GetData($key) {
		$data = $_POST[$key];
		return chop($data);
	}
	
	//[Lap_Distance] => 202\r\n\0\n    [Engine_RPM] => 7170\r\n\0\n    [Throttle_Pos] => 0\n    [G_Force_Lat] => -0.03\r\n\0\n    [G_Force_Long] => 0.39\r\n\0\n)\n</pre>"
	$lap_distance	= GetData('Lap_Distance');
	$throttle_pos	= GetData('Thr_Pos_Driver');
	//$brake_status	= GetData('');
	$gear		= GetData('Gear');
	$steered_angle	= GetData('Steering_Angle');
	$engine_rpm	= GetData('Engine_RPM');
	$fuel_used	= GetData('Fuel_Used_ECU');
	$eng_temp	= GetData('Engine_Temp');
	$eng_oil_temp	= GetData('Eng_Oil_Temp');
	$gbox_oil_temp	= GetData('Gbox_Oil_Temp');
	$brake_temp_f	= GetData('Brake_Temp_Front');
	$brake_temp_r	= GetData('Brake_Temp_Rear');
	$ground_speed	= GetData('Ground_Speed');
	$g_lat		= GetData('G_Force_Lat');
	$g_long		= GetData('G_Force_Long');

    $tyre_temp_fl	= GetData('Tyre_Temp_FL');
	$tyre_temp_fr	= GetData('Tyre_Temp_FR');
	$tyre_temp_rl	= GetData('Tyre_Temp_RL');
	$tyre_temp_rr	= GetData('Tyre_Temp_RR');

	$tyre_pres_fl	= GetData('Tyre_Pres_FL');
	$tyre_pres_fr	= GetData('Tyre_Pres_FR');
	$tyre_pres_rl	= GetData('Tyre_Pres_RL');
	$tyre_pres_rr	= GetData('Tyre_Pres_RR');

	//$brake_temp_f	= GetData('Brake_Temp_Front');
	//$brake_temp_r	= GetData('Brake_Temp_Rear');

	$brake_pres_f	= GetData('Brake_Pres_Front');
	$brake_pres_r	= GetData('Brake_Pres_Rear');



	$datetime	= GetData('datetime');

	// MySQLに情報登録する
	$encode = "UTF-8";
	print("server={$spl_server}");
	print("start sql con");
	if (!($cn = mysql_pconnect($sql_server, $sql_user, $sql_pw))) { die; }

	print("start select db");

	if (!(mysql_select_db($sql_db))) { die; }
	
	//$sql = "insert into telemetry (lap_distance, engine_rpm, g_lat, g_long, datetime) values ('$lap_distance', '$engine_rpm', '$g_lat', '$g_long', '$datetime')";
	//$sql = "insert into telemetry (lap_distance, throttle_pos, gear, steered_angle, engine_rpm, fuel_used , eng_temp, eng_oil_temp, gbox_oil_temp, brake_temp_f, brake_temp_r, ground_speed, g_lat, g_long, datetime ) values ('$lap_distance', '$throttle_pos', $gear', '$steered_angle', '$engine_rpm', '$fuel_used ', '$eng_temp', '$eng_oil_temp', '$gbox_oil_temp', '$brake_temp_f', '$brake_temp_r', '$ground_speed', '$g_lat', '$g_long', '$datetime')";
	//lap_distance, throttle_pos, brake_status, gear, steered_angle, engine_rpm, fuel_used , eng_temp, eng_oil_temp, gbox_oil_temp, brake_temp_f, brake_temp_r, ground_speed, g_lat, g_long, datetime, 
	//'$lap_distance', '$throttle_pos', '$brake_status', '$gear', '$steered_angle', '$engine_rpm', '$fuel_used ', '$eng_temp', '$eng_oil_temp', '$gbox_oil_temp', '$brake_temp_f', '$brake_temp_r', '$ground_speed', '$g_lat', '$g_long', '$datetime', 

	$sql = "insert into telemetry (lap_distance, throttle_pos, gear, steered_angle, engine_rpm, fuel_used , eng_temp, eng_oil_temp, gbox_oil_temp, brake_temp_f, brake_temp_r, ground_speed, g_lat, g_long, datetime, tyre_temp_fl, tyre_temp_fr, tyre_temp_rl, tyre_temp_rr, tyre_pres_fl, tyre_pres_fr, tyre_pres_rl, tyre_pres_rr, brake_pres_f, brake_pres_r ) 
	values ('$lap_distance', '$throttle_pos', '$gear', '$steered_angle', '$engine_rpm', '$fuel_used', '$eng_temp', '$eng_oil_temp', '$gbox_oil_temp', '$brake_temp_f', '$brake_temp_r', '$ground_speed', '$g_lat', '$g_long', '$datetime', '$tyre_temp_fl', '$tyre_temp_fr', '$tyre_temp_rl', '$tyre_temp_rr', '$tyre_pres_fl', '$tyre_pres_fr', '$tyre_pres_rl', '$tyre_pres_rr', '$brake_pres_f', '$brake_pres_r')";


	print("start sql query {$sql}");
	
	if (!(mysql_query($sql))) { die; }
	else { print("sql ok"); }
	
	mysql_close($cn);
	print("close sql");

	print("-----------------------");
?>
