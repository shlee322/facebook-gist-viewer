(function(){
    var GIST_URL_RE = /http(s)?:\/\/gist\.github\.com\/[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}\/[\da-f]+/g;
    var jsonp_id = 0;

    function load_gist(url, user_content) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4 || xhr.status !== 200)
                return;

            var result = JSON.parse(xhr.responseText);
            if(!document.getElementById('_fgv_stylesheet_')) {
                var link = document.createElement('link');
                link.id = '_fgv_stylesheet_';
                link.rel = 'stylesheet';
                link.href = result.stylesheet;
                document.head.appendChild(link);
            }
            
            var content = document.createElement('div');
            content.style = 'width: 100%; height: 10px';
            content.innerHTML = result.div;
            user_content.appendChild(content);
        };
        xhr.open('GET', url + '.json', true);
        xhr.send();
    }

    function inject_gist(user_contents) {
        for(var user_content_i=0; user_content_i<user_contents.length; user_content_i++) {
            var user_content = user_contents[user_content_i];

            if(user_content.innerHTML.indexOf('_fgv_div_') != -1) continue;
            user_content.innerHTML += '<div class="_fgv_div_"></div>';

            var re = new RegExp(GIST_URL_RE);
            var gist;
            while(gist = re.exec(user_content.innerHTML)) {
                load_gist(gist[0], user_content);
            }
        }
    }

    setInterval(function () {
        inject_gist(document.getElementsByClassName('userContent'));
    }, 300);
})();
