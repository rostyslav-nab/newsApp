
function customHttp() {
    return {
        get(url, cb) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.addEventListener('load', () => {
                    if (Math.floor(xhr.status / 100) !== 2) {
                        cb(`Error. Status code: ${xhr.status}`, xhr);
                        return;
                    }
                    const response = JSON.parse(xhr.responseText);
                    cb(null, response);
                });

                xhr.addEventListener('error', () => {
                    cb(`Error. Status code: ${xhr.status}`, xhr);
                });

                xhr.send();
            } catch (error) {
                cb(error);
            }
        },
        post(url, body, headers, cb) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', url);
                xhr.addEventListener('load', () => {
                    if (Math.floor(xhr.status / 100) !== 2) {
                        cb(`Error. Status code: ${xhr.status}`, xhr);
                        return;
                    }
                    const response = JSON.parse(xhr.responseText);
                    cb(null, response);
                });

                xhr.addEventListener('error', () => {
                    cb(`Error. Status code: ${xhr.status}`, xhr);
                });

                if (headers) {
                    Object.entries(headers).forEach(([key, value]) => {
                        xhr.setRequestHeader(key, value);
                    });
                }

                xhr.send(JSON.stringify(body));
            } catch (error) {
                cb(error);
            }
        },
    };
}

let http = customHttp();
// init select
document.addEventListener('DOMContentLoaded', function () {
    M.AutoInit();
    loadNews();
});
M.updateTextFields();

let newsService = (function () {
    const apiKey = "c4fde021a993498aac1a5dd390d8b99c";
    const apiUrl = "http://newsapi.org/v2";
    return {
        topHeadlines(country = "ua", cb) {
            http.get(`${apiUrl}/top-headlines?country=${country}&apiKey=${apiKey}`, cb);
        },
        everything(query, cb) {
            http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
        }
    }
})();

const form = document.forms['newsControls'];
const countrySelect = form.elements['country'];
const searchInput = form.elements['search'];

// form.addEventListener('click', (e) => {
//     console.log('wwjbn,df')
//     e.preventDefault();
//     loadNews();
// });

let btn = document.querySelector("button");
btn.onclick = function (e) {
    e.preventDefault();
    loadNews();
}
// Load News function

function loadNews() {
    const country = countrySelect.value;
    const searchText = searchInput.value;
    if (!searchText) {
        newsService.topHeadlines(country, onGetResponse);
    } else {
        newsService.everything(searchText, onGetResponse);
    }
}

function onGetResponse(err, res) {

    if (err) {
        showAlert(err, "error-msg");
        return;
    }

    if (!res.articles.length) {
        // Show empty msg
        return;
    }
    renderNews(res.articles);
}
// function renderNews

function renderNews(news) {
    const newsContainer = document.querySelector('.news-container .row');
    let fragment = "";
    if (newsContainer.children.length) {
        clearContainer(newsContainer);
    }
    news.forEach(newsItem => {
        const el = newsTemplate(newsItem);
        fragment += el;
    });
    newsContainer.insertAdjacentHTML("afterbegin", fragment);
}

// News item template function

function newsTemplate({ urlToImage, title, url, description }) {
    return `
    <div class="col s4">
        <div class="card" id="card-news">
            <div class="card-image">
                <img src="${urlToImage}">
                <span class="card-span">${title || ""}</span>
                <div class="card-content">
                    <div class="desc">${description || ""}</div>
                </div>
                <div class="card-action">
                    <a href="${url}">Read more</a>
                </div>
            </div>
        </div>
    </div>
    `
}


function showAlert(msg, type = "success") {
    M.toast({ html: msg, classes: type });
}

// Clear container
function clearContainer(container) {
    let child = container.lastElementChild;
    while (child) {
        container.removeChild(child);
        child = container.lastElementChild;
    }
}

