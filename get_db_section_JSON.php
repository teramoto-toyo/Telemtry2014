<?php
	include_once ('./server_config.php');
	
	date_default_timezone_set('Europe/Berlin');

	if (!($cn = mysql_pconnect($sql_server, $sql_user, $sql_pw))) { echo "db connect error"; die; }
	if (!(mysql_select_db($sql_db))) { echo "db connect error"; die; }
	
	$sql = "SELECT a.* FROM nur2014_section a WHERE a.id = (SELECT MAX(b.id) FROM nur2014_section b WHERE b.section_index = a.section_index) ORDER BY a.section_index ASC";
	if (!($rs = mysql_query($sql))) { echo "db query error"; die; }

	mb_http_output( 'UTF-8' );

	$ret = "[";

	$did_count = 0;
	while( $row = mysql_fetch_array( $rs, MYSQL_BOTH ) ){
		$id = $row["id"];
		$section_index	= $row['section_index'];
		$lap_number		= $row['lap_number'];
		$driver_index	= $row['driver_index'];
		$section_name	= $row['section_name'];
		$start_v		= $row['start_v'];
		$end_v			= $row['end_v'];
		$in_section		= $row['in_section'];
		$max_speed		= $row['max_speed'];
		$max_speed_v	= $row['max_speed_v'];
		$min_speed		= $row['min_speed'];
		$min_speed_v	= $row['min_speed_v'];
		$max_g			= $row['max_g'];
		$max_g_v		= $row['max_g_v'];
		$tyre_temp_fl	= $row['tyre_temp_fl_in'];
		$tyre_temp_fr	= $row['tyre_temp_fr_in'];
		$tyre_temp_rl	= $row['tyre_temp_rl_in'];
		$tyre_temp_rr	= $row['tyre_temp_rr_in'];
		$tyre_press_fl	= $row['tyre_press_fl'];
		$tyre_press_fr	= $row['tyre_press_fr'];
		$tyre_press_rl	= $row['tyre_press_rl'];
		$tyre_press_rr	= $row['tyre_press_rr'];
		
		$aWk = strptime($row['datetime'], '%Y-%m-%d %H:%M:%S');
		$datetime = strftime('%Y/%m/%d %H:%M:%S',
			mktime($aWk['tm_hour'], $aWk['tm_min'], $aWk['tm_sec'],
			$aWk['tm_mon']+ 1,$aWk['tm_mday'], $aWk['tm_year']+1900));
		
		
		$ret = $ret . '{'.
			'"section_index":'	. $section_index . ', ' .
			'"lap_number":'		. $lap_number . ', ' .
			'"driver_index":'	. $driver_index . ', ' .
			'"section_name":"'	. $section_name . '", ' .
			'"start_v":'		. $start_v . ', ' .
			'"end_v":'			. $end_v . ', ' .
			'"in_section":"'	. $in_section . '", ' .
			'"max_speed":'		. $max_speed . ', ' .
			'"max_speed_v":'	. $max_speed_v . ', ' .
			'"min_speed":'		. $min_speed . ', ' .
			'"min_speed_v":'	. $min_speed_v . ', ' .
			'"max_g":'			. $max_g . ', ' .
			'"max_g_v":'		. $max_g_v . ', ' .
			'"tyre_temp_fl":'	. $tyre_temp_fl . ', ' .
			'"tyre_temp_fr":'	. $tyre_temp_fr . ', ' .
			'"tyre_temp_rl":'	. $tyre_temp_rl . ', ' .
			'"tyre_temp_rr":'	. $tyre_temp_rr . ', ' .
			'"tyre_press_fl":'	. $tyre_press_fl . ', ' .
			'"tyre_press_fr":'	. $tyre_press_fr . ', ' .
			'"tyre_press_rl":'	. $tyre_press_rl . ', ' .
			'"tyre_press_rr":'	. $tyre_press_rr . ', ' .
			'"datetime":"'		. $datetime . '"' .
		'},';
	}
	$ret = substr($ret, 0, -1);
	$ret = $ret . "]";

	echo $ret;
 ?>
 
 