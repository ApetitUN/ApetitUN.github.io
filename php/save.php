<?php

    $stringData = $_POST["value"];

    $myFile = "/json/general.json";
    $fh = fopen($myFile, 'w') or die("can't open file");

    fwrite($fh, $stringData);
    fclose($fh)
?>