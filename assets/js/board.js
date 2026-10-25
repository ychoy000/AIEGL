/* =========================================================
   뉴스 / 자료실 목록 · 검색 · 페이지 · 첨부파일 보기 (Bootstrap Modal)
   ========================================================= */
(function () {
  'use strict';
  var root = window.EG_ROOT || '';
  var PER_PAGE = 8;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function fileIcon(name) {
    var ext = (name.split('.').pop() || '').toLowerCase();
    if (ext === 'pdf') return 'bi-file-earmark-pdf text-danger';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].indexOf(ext) > -1) return 'bi-file-earmark-image text-success';
    if (['xls', 'xlsx', 'csv'].indexOf(ext) > -1) return 'bi-file-earmark-excel text-success';
    if (['hwp', 'hwpx', 'doc', 'docx'].indexOf(ext) > -1) return 'bi-file-earmark-text text-primary';
    if (['zip'].indexOf(ext) > -1) return 'bi-file-earmark-zip';
    return 'bi-file-earmark';
  }
  function attachHtml(post) {
    var h = '<div class="attach-box mt-4"><div class="attach-head"><i class="bi bi-paperclip me-1"></i>첨부파일 <span class="text-muted fw-normal">(' + post.files.length + ')</span></div>';
    if (post.files.length) {
      h += '<ul>';
      post.files.forEach(function (f) {
        h += '<li><a href="' + root + esc(f.path) + '" download="' + esc(f.name) + '" target="_blank" rel="noopener">' +
          '<i class="bi ' + fileIcon(f.name) + ' fs-5"></i><span>' + esc(f.name) + '</span>' +
          '<span class="size">' + esc(f.size || '') + '</span><i class="bi bi-download"></i></a></li>';
      });
      h += '</ul>';
    } else if (post.restricted) {
      h += '<div class="empty"><i class="bi bi-lock me-1"></i>서비스 의뢰자에게만 개별 제공되는 자료입니다. 온라인상담 또는 이메일로 문의해 주세요.</div>';
    } else {
      h += '<div class="empty">첨부된 파일이 없습니다.</div>';
    }
    return h + '</div>';
  }

  /* ---------- 상세 보기 모달 ---------- */
  var modalEl;
  function ensureModal() {
    if (modalEl) return modalEl;
    var d = document.createElement('div');
    d.innerHTML = '<div class="modal fade" id="postModal" tabindex="-1" aria-labelledby="postModalTitle" aria-hidden="true">' +
      '<div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"><div class="modal-content">' +
      '<div class="modal-header"><div><h2 class="modal-title fs-5 fw-bold" id="postModalTitle"></h2><small class="text-muted" id="postModalDate"></small></div>' +
      '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="닫기"></button></div>' +
      '<div class="modal-body" id="postModalBody"></div>' +
      '<div class="modal-footer"><button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">닫기</button></div>' +
      '</div></div></div>';
    modalEl = d.firstChild;
    document.body.appendChild(modalEl);
    return modalEl;
  }
  function openPost(post) {
    var m = ensureModal();
    m.querySelector('#postModalTitle').textContent = post.title;
    m.querySelector('#postModalDate').innerHTML = '<i class="bi bi-calendar3 me-1"></i>' + esc(post.date);
    var b = '';
    if (post.thumb) {
      var big = (post.files[0] && /\.(jpe?g|png|gif|webp)$/i.test(post.files[0].path)) ? post.files[0].path : post.thumb;
      b += '<img class="w-100 rounded mb-3 border" src="' + root + esc(big) + '" alt="">';
    }
    if (post.summary) b += '<div class="post-body">' + esc(post.summary) + '</div>';
    b += attachHtml(post);
    m.querySelector('#postModalBody').innerHTML = b;
    bootstrap.Modal.getOrCreateInstance(m).show();
  }

  function pagination(el, total, page, go) {
    if (!el) return;
    var pages = Math.max(1, Math.ceil(total / PER_PAGE));
    var h = '<ul class="pagination justify-content-center mt-5">';
    h += '<li class="page-item' + (page <= 1 ? ' disabled' : '') + '"><a class="page-link" href="#" data-p="' + (page - 1) + '" aria-label="이전"><i class="bi bi-chevron-left"></i></a></li>';
    for (var i = 1; i <= pages; i++) h += '<li class="page-item' + (i === page ? ' active' : '') + '"><a class="page-link" href="#" data-p="' + i + '">' + i + '</a></li>';
    h += '<li class="page-item' + (page >= pages ? ' disabled' : '') + '"><a class="page-link" href="#" data-p="' + (page + 1) + '" aria-label="다음"><i class="bi bi-chevron-right"></i></a></li></ul>';
    el.innerHTML = h;
    el.querySelectorAll('a[data-p]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); var p = +a.getAttribute('data-p'); if (p >= 1 && p <= pages) go(p); });
    });
  }

  function filter(list, q) {
    q = (q || '').trim().toLowerCase();
    list = list.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });  /* 최신순 */
    if (!q) return list;
    return list.filter(function (p) { return (p.title + ' ' + (p.summary || '')).toLowerCase().indexOf(q) > -1; });
  }

  /* ---------- 뉴스 카드 그리드 ---------- */
  function renderNews(grid) {
    var data = window.EG_NEWS || [];
    var limit = +grid.getAttribute('data-limit') || 0;
    var pager = document.getElementById(grid.getAttribute('data-pager'));
    var search = document.getElementById(grid.getAttribute('data-search'));
    var page = 1;
    function draw() {
      var list = filter(data, search && search.value);
      var items = limit ? list.slice(0, limit) : list.slice((page - 1) * PER_PAGE, page * PER_PAGE);
      if (!items.length) { grid.innerHTML = '<div class="col-12 text-center text-muted py-5">검색 결과가 없습니다.</div>'; }
      else {
        grid.innerHTML = items.map(function (p) {
          return '<div class="col-sm-6 col-lg-3"><a class="news-card d-block text-decoration-none" href="' + root + 'support/news-view.html?id=' + encodeURIComponent(p.id) + '" data-id="' + esc(p.id) + '" aria-label="' + esc(p.title) + ' 자세히 보기">' +
            '<div class="thumb"><img src="' + root + esc(p.thumb) + '" alt="" ></div>' +
            '<div class="body"><div class="title">' + esc(p.title) + '</div>' +
            '<div class="meta"><span>' + esc(p.date) + '</span>' +
            (p.video || p.youtube ? '<span class="att"><i class="bi bi-play-circle"></i> 영상</span>' : (p.files.length ? '<span class="att"><i class="bi bi-paperclip"></i> ' + p.files.length + '</span>' : '')) +
            '</div></div></a></div>';
        }).join('');
      }
      /* 뉴스 카드는 상세 페이지(support/news-view.html)로 이동 — 모달 사용 안 함 */
      if (!limit) pagination(pager, list.length, page, function (p) { page = p; draw(); });
    }
    if (search) {
      var form = search.closest('form');
      if (form) form.addEventListener('submit', function (e) { e.preventDefault(); page = 1; draw(); });
    }
    draw();
  }

  /* ---------- 자료실 리스트 ---------- */
  function renderArchive(listEl) {
    var data = window.EG_ARCHIVE || [];
    var pager = document.getElementById(listEl.getAttribute('data-pager'));
    var search = document.getElementById(listEl.getAttribute('data-search'));
    var page = 1;
    function draw() {
      var list = filter(data, search && search.value);
      var items = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);
      if (!items.length) { listEl.innerHTML = '<div class="text-center text-muted py-5">검색 결과가 없습니다.</div>'; }
      else {
        listEl.innerHTML = items.map(function (p) {
          var att = p.files.length
            ? '<span class="badge badge-att"><i class="bi bi-paperclip"></i> 첨부 ' + p.files.length + '</span>'
            : (p.restricted ? '<span class="badge text-bg-light"><i class="bi bi-lock"></i> 의뢰자 전용</span>' : '');
          return '<div class="board-item" tabindex="0" role="button" data-id="' + esc(p.id) + '">' +
            '<div class="flex-grow-1 min-w-0"><h3>' + esc(p.title) + '</h3>' +
            (p.summary ? '<div class="excerpt">' + esc(p.summary) + '</div>' : '') +
            '<div class="meta"><span><i class="bi bi-calendar3 me-1"></i>' + esc(p.date) + '</span>' + att + '</div></div>' +
            '<i class="bi bi-arrow-right go"></i></div>';
        }).join('');
      }
      listEl.querySelectorAll('.board-item').forEach(function (c) {
        var post = data.filter(function (p) { return p.id === c.getAttribute('data-id'); })[0];
        c.addEventListener('click', function () { openPost(post); });
        c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPost(post); } });
      });
      pagination(pager, list.length, page, function (p) { page = p; draw(); });
    }
    if (search) {
      var form = search.closest('form');
      if (form) form.addEventListener('submit', function (e) { e.preventDefault(); page = 1; draw(); });
    }
    draw();
  }

  document.querySelectorAll('[data-board="news"]').forEach(renderNews);
  document.querySelectorAll('[data-board="archive"]').forEach(renderArchive);
})();
