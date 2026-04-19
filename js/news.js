// Load news from news.json and render cards
(function () {
  var container = document.getElementById('news-list');
  if (!container) return;
  var newsUrl = '/news.json';

  fetch(newsUrl)
    .then(function (res) {
      if (!res.ok) {
        throw new Error('Failed to load news feed: ' + res.status);
      }
      return res.json();
    })
    .then(function (items) {
      if (!items || items.length === 0) {
        container.innerHTML = '<p style="color: #999;">No news items yet.</p>';
        return;
      }

      // Sort by date, newest first
      items.sort(function (a, b) {
        return (b.date || '').localeCompare(a.date || '');
      });

      var html = '';
      items.forEach(function (item) {
        var dateStr = '';
        if (item.date) {
          var d = new Date(item.date + 'T00:00:00');
          dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        }

        html += '<div class="card">';
        html += '<h3>' + escapeHtml(item.title) + '</h3>';
        if (item.description) {
          html += '<p>' + escapeHtml(item.description) + '</p>';
        }
        if (item.image) {
          html += '<figure class="news-media">';
          html += '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.imageAlt || item.title || 'News image') + '" class="news-image">';
          if (item.imageCaption) {
            html += '<figcaption class="news-caption">' + escapeHtml(item.imageCaption) + '</figcaption>';
          }
          html += '</figure>';
        }
        if (dateStr) {
          html += '<p class="meta">' + dateStr + '</p>';
        }
        if (item.link) {
          html += '<div class="link-row">';
          html += '<a href="' + escapeHtml(item.link) + '" target="_blank" rel="noopener" class="btn btn-outline">Read more &rarr;</a>';
          html += '</div>';
        }
        html += '</div>';
      });

      container.innerHTML = html;
    })
    .catch(function () {
      container.innerHTML = '<p style="color: #999;">Unable to load news.</p>';
    });

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
})();
