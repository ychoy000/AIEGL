AIEcoGenLab 홈페이지 (Bootstrap 5.3 + Bootstrap JS)
=====================================================
폴더 구조
  index.html            메인
  about/                AIEcoGenLab 소개 (인사말, 비전, 연혁, 조직도, 오시는길)
  service/              서비스 (유전정보 분석, 사료설계, 메탄 저감, 인공지능)
  support/              고객지원 (뉴스, 자료실, 온라인상담)
  assets/css/style.css  디자인
  assets/js/layout.js   공통 메뉴(2단계)·상단 고정 네비게이션·서브배너·푸터  ← 메뉴 수정은 여기 MENU
  assets/js/board-data.js  뉴스·자료실 게시물 데이터 (첨부파일 목록)          ← 새 글 추가는 여기
  assets/js/board.js    뉴스·자료실 목록/검색/첨부파일 보기
  files/                첨부파일 (브로슈어 PDF, files/news, files/archive)

뉴스/자료실 글 추가
  1) 첨부파일을 files/news/ 또는 files/archive/ 에 복사
  2) assets/js/board-data.js 의 EG_NEWS 또는 EG_ARCHIVE 에 항목 추가 (날짜순 자동 정렬)

참고
  - Bootstrap, 아이콘, 글꼴(Pretendard)은 CDN(jsdelivr)에서 불러오므로 인터넷 연결이 필요합니다.
  - 온라인상담은 서버 없이 동작하도록 '메일 작성 창 열기(mailto)' 방식입니다.
  - 오시는길 지도는 클릭 시 카카오맵이 새 창으로 열립니다.
