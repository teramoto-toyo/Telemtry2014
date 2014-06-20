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
	
	//最新のtelemetry data 取得
	$sql = "SELECT * FROM nur2014_telemetry ORDER BY id DESC  LIMIT 1";
	if (!($rs = mysql_query($sql))) { echo "db query error"; die; }
	mb_http_output( 'UTF-8' );
	$data1 = mysql_fetch_array( $rs, MYSQL_BOTH );
	
	//最新のセクションデータ取得
	$section_sql = "SELECT a.* FROM nur2014_section a WHERE a.id = (SELECT MAX(b.id) FROM nur2014_section b WHERE b.section_index = a.section_index) ORDER BY a.section_index ASC";
	if (!($rs = mysql_query($section_sql))) { echo "db query error"; die; }
	mb_http_output( 'UTF-8' );
	$data2 = mysql_fetch_array( $rs, MYSQL_BOTH );
	
	$url = 'http://66.147.244.133/~sdogjp/nur2014/relay_catch.php';
	$data = array($data1, $data2);
	$options = array('http' => array(
	    'method' => 'POST',
	    'content' => http_build_query($data),
	));
	$contents = file_get_contents($url, false, stream_context_create($options));
	
	echo $contents;
?>
</body>
</html>
