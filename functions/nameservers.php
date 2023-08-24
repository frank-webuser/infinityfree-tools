<?php
    if(preg_match('/\b([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}\b/', $_GET['domain'])) {
        // echo '<div>Nameservers of: ' . $_GET['domain'] . ':</div>';
        $domain = $_GET['domain'];
        $records = dns_get_record($domain, DNS_NS);
        $test = '/(\.ns\.cloudflare\.com|ns[12]\.(epizy|infinityfree)\.com|ns[1-5]\.byet\.org)/';
        echo '<table><tr><th>Type</th><th>Value</th><th>Status</th></tr>';
        foreach($records as $record) {
            echo '<tr><td>NS</td><td>' . $record['target'] . '</td><td><span class="' . (preg_match($test, $record['target']) ? '' : 'in') . 'valid"></span></td>';
        };
        echo '</table>';
    } else {
        echo '<script>hide_wait();show_alert("close", "An error had occurred.", "The domain name is invalid.");</script>';
    }
?>