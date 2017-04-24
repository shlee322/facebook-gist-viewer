// ==UserScript==
// @name Facebook Gist Viewer
// @namespace https://github.com/shlee322/facebook-gist-viewer
// @version 0.1.2
// @description Sexy github gist viewer on Facebook.
// @updateURL https://github.com/shlee322/facebook-gist-viewer/raw/master/facebook-gist.user.js
// @grant GM_xmlhttpRequest
// @include https://www.facebook.com/*
// ==/UserScript==

(function() {
    var GIST_URL_RE = /https:\/\/gist\.github\.com\/[A-Za-z\d](?:[A-Za-z\d]|-(?=[A-Za-z\d])){0,38}\/[\dA-Fa-f]+/g;
    var jsonp_id = 0;

    function doAjax(method, url, callback) {
        if (window.GM_xmlhttpRequest) {
            GM_xmlhttpRequest({
                method: method,
                url: url,
                onload: callback,
            });
        } else {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState !== 4 || xhr.status !== 200) return;
                callback(xhr);
            };
            xhr.open(method, url, true);
        }
    }

    function load_gist(url, user_content) {
        doAjax('GET', url + '.json', function(xhr) {
            var result = JSON.parse(xhr.response);
            if(!document.getElementById('_fgv_stylesheet_')) {
                var link = document.createElement('link');
                link.id = '_fgv_stylesheet_';
                link.rel = 'stylesheet';
                link.href = result.stylesheet;
                document.head.appendChild(link);
            }
            user_content.innerHTML += '<div style="width:100%; height:10px;"></div>' + result.div;
        });
    }

    function is_exist_gist_div(user_content, gist_url) {
        var elements = user_content.getElementsByClassName('_fgv_div_');
        for(var i=0; i<elements.length; i++) if(elements[i].getAttribute('data-gist-url') == gist_url) return true;
        return false;
    }

    function inject_gist(user_contents) {
        for(var user_content_i=0; user_content_i<user_contents.length; user_content_i++) {
            var user_content = user_contents[user_content_i];

            var re = new RegExp(GIST_URL_RE);
            while(re.test(user_content.innerHTML)) {
                var gist = new RegExp(GIST_URL_RE).exec(user_content.innerHTML);
                if(is_exist_gist_div(user_content, gist[0])) continue;

                user_content.innerHTML += '<div class="_fgv_div_" data-gist-url="' + gist[0] + '"></div>';
                load_gist(gist[0], user_content);
            }
        }
    }

    setInterval(function() {
        inject_gist(document.getElementsByClassName('userContent'));
    }, 300);
})();
