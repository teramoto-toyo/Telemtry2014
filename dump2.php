<?php
var_dump($_POST);
$filename = 'dump2.txt';
file_put_contents($filename, $_POST);
?>