/* =========================================================
   뉴스 상세 페이지 (support/news-view.html?id=뉴스ID)
   - board-data.js 의 EG_NEWS 에서 id 로 글을 찾아 표시
   - video(mp4)가 있으면 페이지 표시 약 1초 후 자동 재생
     (브라우저가 소리 있는 자동재생을 막으면 음소거로 재생 + '소리 켜기' 버튼 표시)
   - mp4 가 없고 youtube 주소만 있으면 유튜브 영상을 삽입해 자동 재생
   - image/body 가 있으면 신문기사형(기사 캡처 + 본문)으로 표시
   ========================================================= */
(function () {
  'use strict';
  var root = window.EG_ROOT || '../';
  var AUTOPLAY_DELAY = 1000;   /* 자동 재생까지 대기 시간(ms) */

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function fileUrl(p) { return root + encodeURI(p).replace(/#/g, '%23'); }
  function youtubeId(u) {
    var m = String(u || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : '';
  }

  var id = new URLSearchParams(location.search).get('id');
  var list = window.EG_NEWS || [];
  var post = list.filter(function (p) { return p.id === id; })[0];

  var titleEl = document.getElementById('nvTitle');
  var dateEl = document.getElementById('nvDate');
  var bodyEl = document.getElementById('nvBody');

  if (!post) {
    titleEl.textContent = '해당 뉴스를 찾을 수 없습니다.';
    bodyEl.innerHTML = '<p class="text-center text-muted py-5">목록에서 다시 선택해 주세요.</p>';
    return;
  }

  titleEl.textContent = post.title;
  dateEl.textContent = post.date;
  document.title = post.title + ' | 뉴스 | AIEcoGenLab';

  var h = '';
  var yid = youtubeId(post.youtube);

  /* ---- 영상형 뉴스 ---- */
  if (post.video) {
    h += '<div class="nv-media">' +
      '<video id="nvVideo" class="nv-video" controls playsinline preload="auto">' +
      '<source src="' + fileUrl(post.video) + '" type="video/mp4">' +
      '브라우저가 동영상 재생을 지원하지 않습니다.</video>' +
      '<button type="button" class="nv-unmute d-none" id="nvUnmute"><i class="bi bi-volume-mute-fill me-1"></i>소리 켜기</button>' +
      '</div>';
  } else if (yid) {
    h += '<div class="nv-media ratio ratio-16x9" id="nvYoutube" data-yid="' + yid + '"></div>';
  }

  /* ---- 신문기사형 뉴스 ---- */
  if (post.image) {
    h += '<figure class="nv-article-img"><img src="' + fileUrl(post.image) + '" alt="' + esc(post.title) + ' 기사 화면"></figure>';
  }
  if (post.caption) h += '<p class="nv-caption">' + esc(post.caption) + '</p>';
  if (post.body) {
    h += '<div class="nv-text">' + post.body.split('\n').map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>';
  }
  if (post.source) h += '<p class="nv-source"><i class="bi bi-newspaper me-1"></i>출처: ' + esc(post.source) + '</p>';

  /* ---- 유튜브 / 첨부 링크 ---- */
  var links = '';
  if (post.youtube) {
    links += '<a class="btn btn-sm nv-yt-btn" href="' + esc(post.youtube) + '" target="_blank" rel="noopener"><i class="bi bi-youtube me-1"></i>YouTube에서 보기</a>';
  }
  (post.files || []).forEach(function (f) {
    links += '<a class="btn btn-sm btn-outline-secondary" href="' + fileUrl(f.path) + '" download="' + esc(f.name) + '"><i class="bi bi-download me-1"></i>' + esc(f.name) + '</a>';
  });
  if (links) h += '<div class="nv-links">' + links + '</div>';

  bodyEl.innerHTML = h;

  /* ---- 약 1초 후 자동 재생 ---- */
  var video = document.getElementById('nvVideo');
  if (video) {
    var unmute = document.getElementById('nvUnmute');
    var failed = false;
    video.addEventListener('error', fallbackToYoutube, true);
    video.querySelector('source').addEventListener('error', fallbackToYoutube);
    setTimeout(function () {
      if (failed) return;
      video.muted = false;
      var p = video.play();
      if (p && p.catch) {
        p.catch(function () {
          /* 소리 있는 자동재생이 막힌 경우: 음소거로 재생 */
          video.muted = true;
          video.play().then(function () { unmute.classList.remove('d-none'); }).catch(function () {});
        });
      }
    }, AUTOPLAY_DELAY);
    unmute.addEventListener('click', function () {
      video.muted = false; video.volume = 1; video.play();
      unmute.classList.add('d-none');
    });
    video.addEventListener('volumechange', function () { if (!video.muted) unmute.classList.add('d-none'); });

    /* mp4 파일을 못 찾으면 유튜브로 대체 */
    function fallbackToYoutube() {
      if (failed || !yid) return;
      failed = true;
      var media = video.parentNode;
      media.outerHTML = '<div class="nv-media ratio ratio-16x9" id="nvYoutube" data-yid="' + yid + '"></div>';
      embedYoutube();
    }
  }

  function embedYoutube() {
    var box = document.getElementById('nvYoutube');
    if (!box) return;
    setTimeout(function () {
      box.innerHTML = '<iframe src="https://www.youtube.com/embed/' + box.getAttribute('data-yid') +
        '?autoplay=1&mute=1&playsinline=1&rel=0" title="' + esc(post.title) + '" ' +
        'allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    }, AUTOPLAY_DELAY);
  }
  embedYoutube();
})();
