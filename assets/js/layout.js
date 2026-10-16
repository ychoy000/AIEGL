/* =========================================================
   AIEcoGenLab 공통 레이아웃 (헤더 · 서브배너 · 위치바 · 푸터)
   - 메뉴를 바꾸려면 아래 MENU 만 수정하면 모든 페이지에 반영됩니다.
   - 각 페이지 <body>에 data-root, data-section, data-page 를 지정합니다.
   ========================================================= */
(function () {
  'use strict';

  var MENU = [
    {
      id: 'about', title: 'AIEcoGenLab 소개', dir: 'about/',
      items: [
        { id: 'greeting', title: '인사말', href: 'greeting.html' },
        { id: 'vision', title: '비전', href: 'vision.html' },
        { id: 'history', title: '연혁', href: 'history.html' },
        { id: 'organization', title: '조직도', href: 'organization.html' },
        { id: 'location', title: '오시는길', href: 'location.html' }
      ]
    },
    {
      id: 'service', title: '서비스', dir: 'service/',
      items: [
        { id: 'genetics', title: '유전정보 분석 서비스', href: 'genetics.html' },
        { id: 'feeding', title: '사료설계 서비스', href: 'feeding.html' },
        { id: 'methane', title: '메탄 저감 서비스', href: 'methane.html' },
        { id: 'ai', title: '인공지능 서비스', href: 'ai.html' }
      ]
    },
    {
      id: 'support', title: '고객지원', dir: 'support/',
      items: [
        { id: 'news', title: '뉴스', href: 'news.html' },
        { id: 'archive', title: '자료실', href: 'archive.html' },
        { id: 'consult', title: '온라인상담', href: 'consult.html' }
      ]
    }
  ];

  var COMPANY = {
    name: 'AIEcoGenLab',
    nameKo: '주식회사 에이아이에코젠랩',
    addrKo: '서울특별시 관악구 호암로24길 6, 402호(신림동, 창업히어로 5)',
    addrEn: 'Rm 402, Hoam-ro, 24-gil 6, Gwanak-gu, Seoul 08812, Republic of Korea',
    email: 'aiecogenlab@gmail.com',
    tel: '050-6780-2164'
  };
  window.EG_COMPANY = COMPANY;
  window.EG_MENU = MENU;

  var body = document.body;
  var root = body.getAttribute('data-root') || '';
  var curSection = body.getAttribute('data-section') || '';
  var curPage = body.getAttribute('data-page') || '';
  window.EG_ROOT = root;

  function url(sec, item) { return root + sec.dir + item.href; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  /* ---------- 헤더 (2단계 메뉴, 상단 고정) ---------- */
  var nav = '<nav class="navbar navbar-expand-lg fixed-top eg-navbar" aria-label="주 메뉴"><div class="container">' +
    '<a class="navbar-brand" href="' + root + 'index.html"><img src="' + root + 'assets/img/logo.png" alt="AIEcoGenLab 홈"></a>' +
    '<button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#egNav" aria-controls="egNav" aria-expanded="false" aria-label="메뉴 열기"><i class="bi bi-list fs-2"></i></button>' +
    '<div class="collapse navbar-collapse justify-content-end" id="egNav"><ul class="navbar-nav">';
  MENU.forEach(function (sec) {
    var active = sec.id === curSection ? ' active' : '';
    nav += '<li class="nav-item dropdown' + active + '">' +
      '<a class="nav-link dropdown-toggle" href="' + url(sec, sec.items[0]) + '" role="button" data-bs-toggle="dropdown" aria-expanded="false">' + esc(sec.title) + '</a>' +
      '<ul class="dropdown-menu">';
    sec.items.forEach(function (it) {
      var a = (sec.id === curSection && it.id === curPage) ? ' active" aria-current="page' : '';
      nav += '<li><a class="dropdown-item' + a + '" href="' + url(sec, it) + '">' + esc(it.title) + '</a></li>';
    });
    nav += '</ul></li>';
  });
  nav += '</ul></div></div></nav>';

  var header = document.getElementById('eg-header');
  if (header) header.outerHTML = nav;

  /* 데스크톱: 1단계 메뉴 클릭 시 첫 번째 하위 페이지로 이동 (hover 로 하위메뉴 표시) */
  var mq = window.matchMedia('(min-width: 992px)');
  document.querySelectorAll('.eg-navbar .nav-link.dropdown-toggle').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (mq.matches) { e.preventDefault(); e.stopPropagation(); window.location.href = a.getAttribute('href'); }
    });
  });

  /* ---------- 서브 비주얼 + 위치 바 ---------- */
  var subSlot = document.getElementById('eg-subvisual');
  if (subSlot) {
    var sec = MENU.filter(function (s) { return s.id === curSection; })[0];
    if (sec) {
      var page = sec.items.filter(function (i) { return i.id === curPage; })[0] || sec.items[0];
      var html = '<section class="sub-visual"><h1>' + esc(sec.title) + '</h1></section>' +
        '<div class="location-bar"><div class="container"><div class="d-flex">' +
        '<a class="loc-home" href="' + root + 'index.html" aria-label="홈"><i class="bi bi-house-door-fill"></i></a>' +
        '<div class="dropdown loc-drop"><button class="btn dropdown-toggle w-100" data-bs-toggle="dropdown" aria-expanded="false">' + esc(sec.title) + '</button><ul class="dropdown-menu">';
      MENU.forEach(function (s) {
        html += '<li><a class="dropdown-item' + (s.id === sec.id ? ' active' : '') + '" href="' + url(s, s.items[0]) + '">' + esc(s.title) + '</a></li>';
      });
      html += '</ul></div><div class="dropdown loc-drop"><button class="btn dropdown-toggle w-100" data-bs-toggle="dropdown" aria-expanded="false">' + esc(page.title) + '</button><ul class="dropdown-menu">';
      sec.items.forEach(function (it) {
        html += '<li><a class="dropdown-item' + (it.id === page.id ? ' active' : '') + '" href="' + url(sec, it) + '">' + esc(it.title) + '</a></li>';
      });
      html += '</ul></div></div></div></div>';
      subSlot.outerHTML = html;
      document.title = page.title + ' | ' + sec.title + ' | AIEcoGenLab';
    }
  }

  /* ---------- 푸터 ---------- */
  var footer = document.getElementById('eg-footer');
  if (footer) {
    footer.outerHTML = '<footer class="eg-footer"><div class="container text-center">' +
      '<div class="brand mb-2">AIEcoGenLab</div>' +
      '<div>' + esc(COMPANY.addrKo) + '</div>' +
      '<div>' + esc(COMPANY.addrEn) + '</div>' +
      '<div class="mt-1">Email: <a href="mailto:' + COMPANY.email + '">' + COMPANY.email + '</a>' +
      '<span class="mx-2">|</span>Tel: <a href="tel:' + COMPANY.tel.replace(/-/g, '') + '">' + COMPANY.tel + '</a>' +
      '</div>' +
      '<div class="copy">Copyright © 2023 AIEcoGenLab Inc. All Rights Reserved.</div>' +
      '</div></footer>' +
      '<button class="to-top" type="button" aria-label="맨 위로"><i class="bi bi-arrow-up"></i></button>';
  }

  /* ---------- 스크롤 동작 ---------- */
  var navEl = document.querySelector('.eg-navbar');
  var topBtn = document.querySelector('.to-top');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (navEl) navEl.classList.toggle('scrolled', y > 10);
    if (topBtn) topBtn.classList.toggle('show', y > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (topBtn) topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* 등장 애니메이션 */
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }
})();
