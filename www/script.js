(function () {
    var request;
    window.addEventListener('load', () => {
        request = document.getElementById('request');
        fetch('/qr').then((res) => {
            if (res.ok) {
                res.text().then((svg) => {
                    request.innerHTML = svg;
                });
            }
        });
    });
})();