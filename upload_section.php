<?php
	include_once ('./server_config.php');
	
	function GetData($key) {
		$data = $_POST[$key];
		return chop($data);
	}
	
	//[Lap_Distance] => 202\r\n\0\n    [Engine_RPM] => 7170\r\n\0\n    [Throttle_Pos] => 0\n    [G_Force_Lat] => -0.03\r\n\0\n    [G_Force_Long] => 0.39\r\n\0\n)\n</pre>"
	$sction_index	= GetData('Section_Index');
	$lap_number		= GetData('Lap_Number');
	$driver_index	= GetData('Driver_Index');
	$section_name	= GetData('section_name');
	$start_v		= GetData('start_v');
	$end_v			= GetData('end_v');
	$in_section		= GetData('in_section');
	$max_speed		= GetData('max_speed');
	$max_speed_v	= GetData('max_speed_v');
	$min_speed		= GetData('min_speed');
	$min_speed_v	= GetData('min_speed_v');
	$max_g			= GetData('max_g');
	$max_g_v		= GetData('max_g_v');
	$tyre_temp_fl	= GetData('tyre_temp_fl');
	$tyre_temp_fr	= GetData('tyre_temp_fr');
	$tyre_temp_rl	= GetData('tyre_temp_rl');
	$tyre_temp_rr	= GetData('tyre_temp_rr');
	$tyre_press_fl	= GetData('tyre_press_fl');
	$tyre_press_fr	= GetData('tyre_press_fr');
	$tyre_press_rl	= GetData('tyre_press_rl');
	$tyre_press_rr	= GetData('tyre_press_rr');
	$datetime		= GetData('datetime');


	// MySQLに情報登録する
	$encode = "UTF-8";
	print("server={$spl_server}");
	print("start sql con");
	if (!($cn = mysql_pconnect($sql_server, $sql_user, $sql_pw))) { die; }

	print("start select db");

	if (!(mysql_select_db($sql_db))) { die; }

	$sql = "insert into nur2014_section (section_index, lap_number, driver_index, section_name, start_v, end_v, in_section, max_speed, max_speed_v, min_speed, min_speed_v, max_g, max_g_v, tyre_temp_fl, tyre_temp_fr, tyre_temp_rl, tyre_temp_rr, tyre_press_fl, tyre_press_fr, tyre_press_rl, tyre_press_rr, datetime) values ( '$sction_index', '$lap_number', '$driver_index', '$section_name', '$start_v', '$end_v', '$in_section', '$max_speed', '$max_speed_v', '$min_speed', '$min_speed_v', '$max_g', '$max_g_v', '$tyre_temp_fl', '$tyre_temp_fr', '$tyre_temp_rl', '$tyre_temp_rr', '$tyre_press_fl', '$tyre_press_fr', '$tyre_press_rl', '$tyre_press_rr', '$datetime')";


/*
"server=start sql constart select dbstart sql query :insert into nur2014_section (sction_index, lap_number, driver_index, section_name, start_v, end_v, in_section, max_speed, max_speed_v, min_speed, min_speed_v, max_g, max_g_v, tyre_temp_fl, tyre_temp_fr, tyre_temp_rl, tyre_temp_rr, tyre_press_fl, tyre_press_fr, tyre_press_rl, tyre_press_rr, datetime) values ( '0', '0', '0', 'Dunlop-Kehre', '1000', '2000', 'False', '187.7', '', '81.3', '1337', '1.65', '1619', '62.78302', '25.5412', '70.23832', '68.91642', '361.5', '361.5', '361.5', '0', '2014/06/17 12:32:29')"
*/


//$filename = 'query2014.txt';
//file_put_contents($filename, $sql);

	print("start sql query :{$sql}");
	
	if (!(mysql_query($sql))) { die; }
	else { print("sql ok"); }
	
	mysql_close($cn);
	print("close sql");

	print("-----------------------");
?>