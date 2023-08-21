var current_page = 1;
var tested = [0, 0, 0, 0];

function show_alert(type, title, msg) {
    var tmp = '<div class="content wait"><div class="alert-wrapper ';
    tmp += type;
    tmp += '"><div class="side-wrapper"><div class="side"><span class="fa fa-';
    tmp += type;
    tmp += '"></span></div></div><div class="alert"><div class="alert-title">';
    tmp += title;
    tmp += '</div><div class="alert-content">';
    tmp += msg;
    tmp += '</div></div></div></div>';
    $("#p" + String(current_page)).prepend(tmp);
}

function hide_wait() {
    $(".wait").remove();
}

function get_nameservers() {
    $.get("functions/nameservers.php?domain=" + $("#domain").val(), function(data, status) {
        if(status == 'success') {
            hide_wait();
            $("#ns").html(data);
            var ns_type = [];
            var result = 'check';
            var title = '';
            var msg = '';
            var cf_ns = /\.ns\.cloudflare\.com/;
            var epizy_ns = /ns[12]\.epizy\.com/;
            var epizy_invalid_ns = /ns[3-9]\.epizy\.com/;
            var if_ns = /ns[12]\.infinityfree\.com/;
            var if_invalid_ns = /ns[3-9]\.infinityfree\.com/;
            var byet_ns = /ns[1-5]\.byet\.org/;
            var byet_invalid_ns = /ns[6-9]\.byet\.org/;
            if(data.search(cf_ns) != -1) {
                ns_type.push('cf');
                title = 'The domain is using Cloudflare nameservers.';
                msg = 'This is OK if the records on the Cloudflare is correct.';
            };
            if(data.search(epizy_ns) != -1) {
                ns_type.push('epizy');
                title = 'The domain is using epizy.com nameservers.';
                msg = 'This is correct if the hosting account starts with epiz_. If not, please use infinityfree.com nameservers.'
            };
            if(data.search(epizy_invalid_ns) != -1) {
                ns_type.push('epizy_invalid');
                result = 'close';
                title = 'The domain is using invalid epizy.com nameservers.';
                msg = 'The domain contains invalid epizy.com nameservers. Note that the epizy.com nameservers only have ns1 and ns2.';
                show_alert(result, title, msg);
            };
            if(data.search(if_ns) != -1) {
                ns_type.push('if_ns');
                title = 'The domain is using infinityfree.com nameservers.';
                msg = 'This is correct if the hosting account starts with if0_. If not, please use epizy.com nameservers.'
            };
            if(data.search(if_invalid_ns) != -1) {
                ns_type.push('if_invalid');
                result = 'close';
                title = 'The domain is using invalid infinityfree.com nameservers.';
                msg = 'The domain contains invalid infinityfree.com nameservers. Note that the infinityfree.com nameservers only have ns1 and ns2.';
                show_alert(result, title, msg);
            };
            if(data.search(byet_ns) != -1) {
                ns_type.push('byet_ns');
                title = 'The domain is using byet.org nameservers.';
                msg = 'This is always correct, so all is good!'
            };
            if(data.search(byet_invalid_ns) != -1) {
                ns_type.push('byet_invalid');
                result = 'close';
                title = 'The domain is using invalid byet.org nameservers.';
                msg = 'The domain contains invalid byet.org nameservers. Note that the byet.org nameservers only have ns1 towards ns5.';
                show_alert(result, title, msg);
            };
            if(data.search(/invalid/) != -1) {
                result = 'close';
                title = 'The domain contains invalid nameservers.';
                msg = 'Please refer to the KB articles for more information.';
            }
            if(ns_type.length == 1 && result == 'check') {
                show_alert(result, title, msg);
            } else {
                if(ns_type.length == 0) {
                    result = 'close';
                    title = 'No nameservers found.';
                    msg = 'Make sure that the domain is already registered.';
                    if(data.search(/\./) != -1) {
                        title = 'The domain contains invaild nameservers.';
                        msg = 'Please refer to the KB articles for more information.';
                    }
                }
                if(result == 'check') {
                    result = 'close';
                    title = 'The domain is mixing nameservers.';
                    msg = 'Please use only one nameserver at a time.';
                }
                show_alert(result, title, msg);
            }
        } else {
            show_alert('close', 'An error had occurred.', 'Please try re-run the test again.');
        }
    })
}

function get_dns_records() {
    $.get("functions/dns.php?domain=" + $("#domain").val(), function(data, status) {
        if(status == 'success') {
            hide_wait();
            $("#dns_records").html(data);
        } else {
            show_alert('close', 'An error had occurred.', 'Please try re-run the test again.');
        }
    });
}

function get_ssl_status() {
    $.get("functions/testssl.php?domain=" + $("#domain").val(), function(data, status) {
        if(status == 'success') {
            hide_wait();
            $("#ssl").html(data);
        } else {
            show_alert('close', 'An error had occurred.', 'Please try re-run the test again.');
        }
    });
}

function get_whois_data() {
    $.get("functions/whois.php?domain=" + $("#domain").val(), function(data, status) {
        if(status == 'success') {
            hide_wait();
            $("#whois").html(data);
        } else {
            show_alert('close', 'An error had occurred.', 'Please try re-run the test again.');
        }
    });
}

function test() {
    console.log(current_page);
    if($("#domain").val().search(/\b([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}\b/) == -1) {
        return;
    }
    hide_wait();
    show_alert('info', 'Fetching data...', 'Please wait for a moment.');
    tested[current_page - 1] = 1;
    switch(current_page) {
        case 1:
            get_nameservers();
            break;
        case 2:
            get_dns_records();
            break;
        case 3:
            get_ssl_status();
            break;
        case 4:
            get_whois_data();
            break;
        default:
            hide_wait();
            tested = [0, 0, 0, 0];
            break;
    }
}

function switch_page(elem) {
    var target = elem.dataset.targetPage;
    current_page = parseInt(target);
    console.log(current_page);
    console.log(tested);
    if(tested[current_page - 1] == 0) {
        test();
        console.log(tested);
    }
    $(".content-wrapper").hide();
    $("#p" + String(target)).show();
    $(".sidenav-item").removeClass("active");
    elem.classList.add("active");
}

function copy_content(elem) {
    navigator.clipboard.writeText($(elem).html().trim());
};

/* var nav_items = document.getElementsByClassName("sidenav-item");
for(var i = 0; i < nav_items.length; i++) {
    nav_items[i].addEventListener("click", switch_page, false);
} */