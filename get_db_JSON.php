<?php
	//$g_record_num = $_GET['record_num'];
	include_once ('./server_config.php');
	
	date_default_timezone_set('Europe/Berlin');

	if (!($cn = mysql_pconnect($sql_server, $sql_user, $sql_pw))) { echo "db connect error"; die; }
	if (!(mysql_select_db($sql_db))) { echo "db connect error"; die; }
	//$sql = "SELECT * FROM `mapcast_entry`  LIMIT 0 , 30";
	$sql = "SELECT * FROM nur2014_telemetry ORDER BY id DESC  LIMIT 1";
	if (!($rs = mysql_query($sql))) { echo "db query error"; die; }

	mb_http_output( 'UTF-8' );

	$ret = "{ \"marker\" : [";

	$did_count = 0;
	while( $row = mysql_fetch_array( $rs, MYSQL_BOTH ) ){

		$lap_distance = $row['lap_distance'];
		$throttle_pos = $row['Thr_pos_driver'];
		$brake_status = 0;
		$gear = $row['gear'];
		$steered_angle = $row['steered_angle'];
		$engine_rpm = $row['engine_rpm'];
		$fuel_used  = $row['fuel_used'];
		$eng_temp = $row['eng_temp'];
		$eng_oil_temp = $row['eng_oil_temp'];
		$gbox_oil_temp = $row['gbox_oil_temp'];
		$brake_temp_f = $row['brake_temp_f'];
		$brake_temp_r = $row['brake_temp_r'];
		$ground_speed = $row['ground_speed'];
		$g_lat = $row['g_lat'];
		$g_long = $row['g_long'];

                $aWk = strptime($row['datetime'], '%Y-%m-%d %H:%M:%S');
                
                $datetime = strftime('%Y/%m/%d %H:%M:%S',
                mktime($aWk['tm_hour'], $aWk['tm_min'], $aWk['tm_sec'],
                $aWk['tm_mon']+ 1,$aWk['tm_mday'], $aWk['tm_year']+1900));

//\"lap_distance\":" . $lap_distance . ", \"throttle_pos\":" . $throttle_pos . ", \"brake_status\":" . $brake_status . ", \"gear\":" . $gear . ", \"steered_angle\":" . $steered_angle . ", \"engine_rpm\":" . $engine_rpm . ", \"fuel_used\":" . $fuel_used . ", \"eng_temp\":" . $eng_temp . ", \"eng_oil_temp\":" . $eng_oil_temp . ", \"gbox_oil_temp\":" . $gbox_oil_temp . ", \"brake_temp_f\":" . $brake_temp_f . ", \"brake_temp_r\":" . $brake_temp_r . ", \"ground_speed\":" . $ground_speed . ", \"g_lat\":" . $g_lat . ", \"g_long\":" . $g_long . ", \"datetime\":" . $datetime . ", 

        //$ret = $ret . "{ \"registtime\":\"" . $registtime . "\", \"g_lat\":" . $g_lat . ", \"g_lon\":" . $g_long . ", \"last_v\":" . $last_v ."  } ";
		$ret = $ret .   "{ \"lap_distance\":" . $lap_distance . ", \"throttle_pos\":" . $throttle_pos . ", \"brake_status\":" . $brake_status . ", \"gear\":" . $gear . ", \"steered_angle\":" . $steered_angle . ", \"engine_rpm\":" . $engine_rpm . ", \"fuel_used\":" . $fuel_used . ", \"eng_temp\":" . $eng_temp . ", \"eng_oil_temp\":" . $eng_oil_temp . ", \"gbox_oil_temp\":" . $gbox_oil_temp . ", \"brake_temp_f\":" . $brake_temp_f . ", \"brake_temp_r\":" . $brake_temp_r . ", \"ground_speed\":" . $ground_speed . ", \"g_lat\":" . $g_lat . ", \"g_long\":" . $g_long . ", \"datetime\":\"" . $datetime . "\"}";
		$did_count = $did_count + 1;
		//if($did_count > 20) break;
	}

	$ret = $ret . "], \"listCount\":" . $did_count . " }";

	echo $ret;
 ?>
 
 