<?php
    if(preg_match('/\b([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}\b/', $_GET['domain'])) {
        echo '<div>DNS Record of: ' . $_GET['domain'] . ':</div>';
        $domain = $_GET['domain'];
        $records = dns_get_record($domain, DNS_A + DNS_CNAME + DNS_MX);
        echo '<table><tr><th>Type</th><th>Name</th><th>Value</th></tr>';
        foreach($records as $record) {
            echo '<tr><td>' . $record['type'] . '</td><td>' . $record['host'] . '</td><td>' . ($record['type'] == 'A' ? $record['ip'] : $record['target']) . '</td>';
        };
        echo '</table>';
    } else {
        echo '<script>hide_wait();show_alert("close", "An error had occurred.", "The domain name is invalid.");</script>';
    }
?>