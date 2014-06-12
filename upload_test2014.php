<?php
	include_once ('./server_config.php');
	
	function GetData($key) {
		$data = $_POST[$key];
		return chop($data);
	}
	
	//[Lap_Distance] => 202\r\n\0\n    [Engine_RPM] => 7170\r\n\0\n    [Throttle_Pos] => 0\n    [G_Force_Lat] => -0.03\r\n\0\n    [G_Force_Long] => 0.39\r\n\0\n)\n</pre>"
	$lap_distance	= GetData('Lap_Distance');
	$lap_number		= GetData('Lap_Number');
	$thr_pos_driver	= GetData('Thr_Pos_Driver');
	$gear			= GetData('Gear');
	$steered_angle	= GetData('Steering_Angle');
	$engine_rpm		= GetData('Engine_RPM');
	$fuel_used		= GetData('Fuel_Used');
	$fuel_used_ecu	= GetData('Fuel_Used_ECU');
	$fuel_used_per_lap	= GetData('Fuel_Used_per_Lap');
	$turbo_pres		= GetData('Turbo_Pres_3');
	$eng_temp		= GetData('Engine_Temp');
	$eng_oil_temp	= GetData('Eng_Oil_Temp');
	$gbox_oil_temp	= GetData('Gbox_Oil_Temp');
	$ambient_air_temp	= GetData('Ambient_Air_Temp');
	$brake_temp_f	= GetData('Brake_Temp_Front');
	$brake_temp_r	= GetData('Brake_Temp_Rear');
	$coolant_pressure	= GetData('Coolant_Pressure');
	$ground_speed	= GetData('Ground_Speed');
	$drive_speed	= GetData('Drive_Speed');
	$g_lat			= GetData('G_Force_Lat');
	$g_long			= GetData('G_Force_Long');
	$tyre_pres_fl	= GetData('Tyre_Pres_FL');
	$tyre_pres_fr	= GetData('Tyre_Pres_FR');
	$tyre_pres_rl	= GetData('Tyre_Pres_RL');
	$tyre_pres_rr	= GetData('Tyre_Pres_RR');
    $tyre_temp_fl_in	= GetData('Tyre_Temp_FL_Inner');
	$tyre_temp_fr_in	= GetData('Tyre_Temp_FR_Inner');
	$tyre_temp_rl_in	= GetData('Tyre_Temp_RL_Inner');
	$tyre_temp_rr_in	= GetData('Tyre_Temp_RR_Inner');
    $tyre_temp_fl_center	= GetData('Tyre_Temp_FL_Centre');
	$tyre_temp_fr_center	= GetData('Tyre_Temp_FR_Centre');
	$tyre_temp_rl_center	= GetData('Tyre_Temp_RL_Centre');
	$tyre_temp_rr_center	= GetData('Tyre_Temp_RR_Centre');
    $tyre_temp_fl_out	= GetData('Tyre_Temp_FL_Outer');
	$tyre_temp_fr_out	= GetData('Tyre_Temp_FR_Outer');
	$tyre_temp_rl_out	= GetData('Tyre_Temp_RL_Outer');
	$tyre_temp_rr_out	= GetData('Tyre_Temp_RR_Outer');
	$susp_force_fl		= GetData('Susp_Force_FL');
	$susp_force_fr		= GetData('Susp_Force_FR');
	$susp_force_rl		= GetData('Susp_Force_RL');
	$susp_force_rr		= GetData('Susp_Force_RR');
	$ride_height_fl		= GetData('Ride_Height_FL');
	$ride_height_fr		= GetData('Ride_Height_FR');
	$ride_height_rear	= GetData('Ride_Height_Rear_(HiRes)');
	$gps_latitude		= GetData('GPS_Latitude');
	$gps_longitude		= GetData('GPS_Longitude');
	$gps_heading		= GetData('GPS_Heading');
	$gps_speed			= GetData('GPS_Speed');
	$brake_pres_f		= GetData('Brake_Pres_Front');
	$brake_pres_r		= GetData('Brake_Pres_Rear');
	$datetime			= GetData('datetime');

	// MySQLに情報登録する
	$encode = "UTF-8";
	print("server={$spl_server}");
	print("start sql con");
	if (!($cn = mysql_pconnect($sql_server, $sql_user, $sql_pw))) { die; }

	print("start select db");

	if (!(mysql_select_db($sql_db))) { die; }

	$sql = "insert into nur2014_telemetry (datetime, lap_distance, lap_number, Thr_pos_driver, gear, steered_angle, engine_rpm, fuel_used, fuel_used_ecu, fuel_used_per_lap, turbo_pres, eng_temp, eng_oil_temp, gbox_oil_temp, ambient_air_temp, brake_temp_f, brake_temp_r, coolant_pressure, ground_speed, drive_speed, g_lat, g_long, tyre_pres_fl, tyre_pres_fr, tyre_pres_rl, tyre_pres_rr, tyre_temp_fl_in, tyre_temp_fr_in, tyre_temp_rl_in, tyre_temp_rr_in, tyre_temp_fl_center, tyre_temp_fr_center, tyre_temp_rl_center, tyre_temp_rr_center, tyre_temp_fl_out, tyre_temp_fr_out, tyre_temp_rl_out, tyre_temp_rr_out, susp_force_fl, susp_force_fr, susp_force_rl, susp_force_rr, ride_height_fl, ride_height_fr, ride_height_rear, gps_latitude, gps_longitude, gps_heading, gps_speed, brake_pres_f, brake_pres_r ) values ( '$datetime', '$lap_distance', '$lap_number', '$thr_pos_driver', '$gear', '$steered_angle', '$engine_rpm', '$fuel_used', '$fuel_used_ecu', '$fuel_used_per_lap', '$turbo_pres', '$eng_temp', '$eng_oil_temp', '$gbox_oil_temp', '$ambient_air_temp', '$brake_temp_f', '$brake_temp_r', '$coolant_pressure', '$ground_speed', '$drive_speed', '$g_lat', '$g_long', '$tyre_pres_fl', '$tyre_pres_fr', '$tyre_pres_rl', '$tyre_pres_rr', '$tyre_temp_fl_in', '$tyre_temp_fr_in', '$tyre_temp_rl_in', '$tyre_temp_rr_in', '$tyre_temp_fl_center', '$tyre_temp_fr_center', '$tyre_temp_rl_center', '$tyre_temp_rr_center', '$tyre_temp_fl_out', '$tyre_temp_fr_out', '$tyre_temp_rl_out', '$tyre_temp_rr_out', '$susp_force_fl', '$susp_force_fr', '$susp_force_rl', '$susp_force_rr' , '$ride_height_fl', '$ride_height_fr', '$ride_height_rear', '$gps_latitude', '$gps_longitude', '$gps_heading', '$gps_speed', '$brake_pres_f', '$brake_pres_r')";
	
//$filename = 'query2014.txt';
//file_put_contents($filename, $sql);

	print("start sql query :{$sql}");
	
	if (!(mysql_query($sql))) { die; }
	else { print("sql ok"); }
	
	mysql_close($cn);
	print("close sql");

	print("-----------------------");
?>