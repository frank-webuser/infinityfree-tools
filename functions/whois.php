<?php

require_once 'vendor/autoload.php';

use Iodev\Whois\Factory;

// Creating default configured client
$whois = Factory::get()->createWhois();

if(!preg_match('/\b([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}\b/', $_GET['domain'])) {
    echo '<script>hide_wait();show_alert("close", "An error had occurred.", "The domain name is invalid.");</script>';
    die;
}

// Checking availability
if ($whois->isDomainAvailable($_GET['domain'])) {
    echo '<script>hide_wait();show_alert("close", "Oops!", "The domain name appears to be unregistered.");</script>';
    die;
}

// Getting parsed domain info
$info = $whois -> loadDomainInfo($_GET['domain']);
$expire = $info -> expirationDate;
if(is_string($info -> expirationDate)) {
    $valid = 999999;
} else {
    $valid = $expire - time();
};
echo '<table>';
echo '<tr><td>Domain created</td><td>' . date("Y-m-d", $info -> creationDate) . '</td></tr>';
if(is_string($expire)) {
    $expout = $expire;
} else {
    $expout = date("Y-m-d", $expire);
};
echo '<tr><td>Domain expires</td><td>' . $expout . '</td></tr>';
echo '<tr><td>Domain owner</td><td>' . $info -> owner . '</td></tr>';
echo '<tr><td>Domain valid</td><td>';
if($valid > 864000) {
    echo '<span class="valid"></span>';
} elseif($valid > 0 && $valid <= 864000) {
    echo '<span class="expire"></span>';
} else {
    echo '<span class="invalid"></span>';
};
echo '</td></tr></table>';

?>