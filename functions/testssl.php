<?php
    function error_handler($errno, $errstr) {
        echo '<script>hide_wait();show_alert("close", "No SSL certificate was found.", "Please refer to the KB articles for more information.")</script>';
        die;
    };
    set_error_handler('error_handler', E_ALL);
    error_reporting(0);
    if(preg_match('/\b([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}\b/', $_GET['domain'])) {
        $domain = $_GET['domain'];
        // echo 'SSL Certficate info of: ' . $domain;
        $get = stream_context_create(array("ssl" => array("capture_peer_cert" => TRUE, "verify_peer" => FALSE, "verify_peer_name" => FALSE)));
        $read = stream_socket_client("ssl://".$domain.":443", $errno, $errstr, 30, STREAM_CLIENT_CONNECT, $get);
        $cert = stream_context_get_params($read);
        $certinfo = openssl_x509_parse($cert['options']['ssl']['peer_certificate']);
        echo '<table><tr><td>Issuer:</td><td>' . (isset($certinfo['issuer']['O']) ? $certinfo['issuer']['O'] : $certinfo['issuer']['CN']) . '</td></tr>';
        echo '<tr><td>Valid From:</td><td>' . gmdate("Y-m-d", $certinfo['validFrom_time_t']) . '</td></tr>';
        echo '<tr><td>Valid To:</td><td>' . gmdate('Y-m-d', $certinfo['validTo_time_t']) . '</td></tr><tr><td>Status:</td><td>';
        $valid = $certinfo['validTo_time_t'] - time();
        if($valid > 864000) {
            echo '<span class="valid"></span>';
        } elseif($valid > 0 && $valid <= 864000) {
            echo '<span class="expire"></span>';
        } else {
            echo '<span class="invalid"></span>';
        };
        echo '</td></tr></table>';
    } else {
        echo '<script>hide_wait();show_alert("close", "An error had occurred.", "The domain name is invalid.");</script>';
    }
?>