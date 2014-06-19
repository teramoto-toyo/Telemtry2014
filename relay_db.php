<html>
<head>
	<meta http-equiv="Refresh" content="1">
</head>
<body>
Data Relaying...<br />
<?php
	include_once ('./server_config.php');
	
	date_default_timezone_set('Europe/Berlin');

	if (!($cn = mysql_pconnect($sql_server, $sql_user, $sql_pw))) { echo "db connect error"; die; }
	if (!(mysql_select_db($sql_db))) { echo "db connect error"; die; }
	
	$sql = "SELECT * FROM nur2014_telemetry ORDER BY id DESC  LIMIT 1";
	
	if (!($rs = mysql_query($sql))) { echo "db query error"; die; }
	mb_http_output( 'UTF-8' );
	
	$url = 'http://66.147.244.133/~sdogjp/nur2014/relay_test.php';
	$data = mysql_fetch_array( $rs, MYSQL_BOTH );
	$options = array('http' => array(
	    'method' => 'POST',
	    'content' => http_build_query($data),
	));
	$contents = file_get_contents($url, false, stream_context_create($options));
	
	echo $contents;
?>
</body>
</html>

 
 