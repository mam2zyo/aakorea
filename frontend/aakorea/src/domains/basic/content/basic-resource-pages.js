export const BASIC_RESOURCE_PAGES = {
  events: {
    key: "events",
    path: "/events",
    menuLabel: "소식·행사",
    eyebrow: "News & Events",
    title: "소식·행사",
    summary:
      "레거시 `event.html`과 일부 공지성 안내를 바탕으로, 공개모임·라운드업·컨벤션·기념행사 같은 일회성 소식을 basic 공개 영역에서 읽기 좋게 다시 정리했습니다.",
    featuredLinks: [
      {
        to: "/meetings",
        label: "정기 모임 찾기",
        description: "행사와 별개로 오늘 열리는 정기 모임과 그룹 상세를 바로 확인합니다.",
      },
      {
        to: "/resources",
        label: "자료실",
        description: "지역연합, 공식 링크, 역사, 팩트 파일 같은 공개 자료 허브로 이동합니다.",
      },
      {
        to: "/gso",
        label: "사무국 안내",
        description: "공개행사 문의와 공식 안내가 필요할 때 가장 먼저 확인할 창구입니다.",
      },
      {
        to: "/library",
        label: "도서·문헌 소개",
        description: "행사와 함께 읽으면 좋은 A.A. 도서와 소책자 소개를 살펴볼 수 있습니다.",
      },
    ],
    sections: [
      {
        title: "이 페이지에서 다루는 소식",
        paragraphs: [
          "원 사이트의 행사 페이지에는 효동그룹 공개모임, 도봉지구위원회 밤샘 마라톤 모임, 충청연합 라운드업, 알아넌/알라틴 컨벤션, 지역 그룹의 공개모임과 창립기념 행사가 함께 실려 있습니다.",
          "이런 정보는 정기 모임 검색과는 성격이 다르므로, basic에서는 `소식·행사`라는 별도 공개 입구로 묶고 정기 모임/그룹 상세와는 구분해 읽기 모델을 제공하는 편이 자연스럽습니다.",
        ],
      },
      {
        title: "주요 행사 유형",
        bullets: [
          {
            label: "공개모임",
            description: "그룹이나 연합이 주최하는 공개모임으로, 주제·일시·장소·봉사자 연락처가 핵심 정보입니다.",
          },
          {
            label: "라운드업",
            description: "충청연합 사례처럼 숙박 또는 장시간 프로그램이 결합된 확장형 행사입니다.",
          },
          {
            label: "컨벤션",
            description: "알아넌/알라틴 컨벤션처럼 1박 2일 이상 운영될 수 있어 시작/종료 시각과 장소 안내가 중요합니다.",
          },
          {
            label: "기념 행사",
            description: "8주년, 20주년 같은 그룹 창립 기념 공개모임은 역사성과 현장 안내를 함께 보여주는 것이 좋습니다.",
          },
          {
            label: "온라인 모임 변경 안내",
            description: "온라인 시간 변경은 행사라기보다 모임 운영 변경 안내에 가깝기 때문에, 장기적으로는 행사 목록이 아니라 모임/공지 흐름과 연결하는 편이 맞습니다.",
          },
        ],
      },
      {
        title: "행사 카드에 꼭 있어야 할 정보",
        bullets: [
          "행사 제목과 유형",
          "주제 또는 행사 취지",
          "시작/종료 일시",
          "장소명과 상세 주소",
          "주최 그룹 또는 연합 이름",
          "여러 명까지 수용 가능한 연락처 목록",
          "포스터 이미지 또는 알림서",
        ],
      },
      {
        title: "원 사이트에서 확인한 대표 예시",
        bullets: [
          {
            label: "효동그룹 공개모임",
            description: "주제, 일시, 장소, 복수 연락처와 포스터 이미지를 함께 제공하는 전형적인 공개모임 형식입니다.",
          },
          {
            label: "도봉지구위원회 밤샘 마라톤 모임",
            description: "심야부터 다음 날 새벽까지 이어지는 일정으로, 일반 행사보다 종료 시각과 운영 안내가 더 중요합니다.",
          },
          {
            label: "제27회 알아넌/알라틴 컨벤션",
            description: "2일 일정, 외부 연수원 장소, 고정 전화와 휴대전화 안내가 함께 제공되는 컨벤션 형식입니다.",
          },
          {
            label: "인천 정서진그룹 8주년 공개모임",
            description: "기념 공개모임은 제목 자체에 역사성을 담고 있어 일반 공지와 구분된 카드가 필요합니다.",
          },
          {
            label: "울산연합 공개모임",
            description: "대표/서기 같은 역할 기반 연락처 표기가 필요한 연합 행사 예시입니다.",
          },
        ],
      },
    ],
    ctas: [
      { label: "가까운 모임 찾기", to: "/meetings", tone: "primary" },
      { label: "사무국 안내", to: "/gso", tone: "secondary" },
    ],
    relatedKeys: ["resources", "guide", "literature", "about"],
  },
  resources: {
    key: "resources",
    path: "/resources",
    menuLabel: "자료실",
    eyebrow: "Public Resources",
    title: "자료실",
    summary:
      "레거시 `members.html`의 공개 정보들을 현재 정보 구조에 맞게 다시 정리한 허브입니다. 지역연합, 공식 링크, 역사, 팩트 파일, 문헌 소개를 한 곳에서 이어 볼 수 있습니다.",
    featuredLinks: [
      {
        to: "/resources/fact-file",
        label: "A.A.에 관한 사실들",
        description: "공식 참조 문서 성격의 팩트 파일을 읽기 좋은 구조로 제공합니다.",
      },
      {
        to: "/library",
        label: "도서·문헌 소개",
        description: "주요 도서와 소책자의 성격을 먼저 살펴본 뒤 스토어로 이동할 수 있습니다.",
      },
      {
        to: "/about/44-questions",
        label: "44가지 질문들",
        description: "초심자, 가족, 전문가가 함께 참고하기 좋은 대표 문답 자료입니다.",
      },
      {
        to: "/gso",
        label: "사무국 안내",
        description: "자료 문의, 그룹 연결, 공식 안내가 필요할 때 확인할 수 있습니다.",
      },
    ],
    sections: [
      {
        title: "왜 별도 자료 허브가 필요한가요?",
        paragraphs: [
          "`members.html`에는 지역연합, 공식 사이트 모음, 한국 A.A. 역사, 행사 일정, 온라인 모임 변경, 공지사항이 한 페이지에 함께 놓여 있었습니다.",
          "이 중 상당수는 계정 기반의 `member` 기능이 아니라 로그인 없이 읽는 공개 자료이므로, basic 공개 영역 안에서 별도 허브로 정리하는 편이 정보 구조상 더 명확합니다.",
        ],
      },
      {
        title: "지역연합",
        bullets: [
          "강원 연합",
          "대경 연합",
          "충청 연합",
          "부경 연합",
          "수도권 서부연합",
          "수도권 남부연합",
          "수도권 북부연합",
          "수도권 동부연합",
          "울산 연합",
          "인천 연합",
          "호남 연합",
        ],
      },
      {
        title: "공식 링크와 참고 사이트",
        bullets: [
          {
            label: "한국 내 영어 그룹",
            description: "국내 영어권 모임 안내용 링크입니다.",
            href: "https://aainkorea.org",
          },
          {
            label: "미국/캐나다 G.S.O.",
            description: "A.A. World Services와 공식 안내 자료를 찾을 수 있는 대표 사이트입니다.",
            href: "https://www.aa.org",
          },
          {
            label: "일본 G.S.O. (JSO)",
            description: "일본어권 공식 안내와 문헌 정보를 참고할 수 있습니다.",
            href: "https://www.aajapan.org",
          },
          {
            label: "몽골 G.S.O.",
            description: "몽골 지역 공식 사이트 안내입니다.",
            href: "https://www.aa.org.mn",
          },
          {
            label: "AA Grapevine",
            description: "포도나무지와 관련 자료를 확인할 수 있는 공식 채널입니다.",
            href: "https://www.aagrapevine.org",
          },
        ],
      },
      {
        title: "한국 A.A. 역사 하이라이트",
        bullets: [
          "1976년: 안성도 신부가 미국 A.A.를 통해 단주를 시작하고 한국에 와 메시지 전달 활동을 시작했습니다.",
          "1976년~1981년: 속초, 강릉, 횡성 지역에서 초기 메시지 전달 활동이 이어졌습니다.",
          "1980년대~1990년대: 지역 확장, 봉사 구조 정비, 전국 단위 모임과 총회가 점차 자리잡기 시작했습니다.",
          "2000년대 이후: 연합 활동과 정기 행사, 전국 규모의 연결 구조가 더 뚜렷해졌습니다.",
        ],
        paragraphs: [
          "세부 연표는 너무 길기 때문에 이 페이지에서는 흐름 중심으로 요약하고, 장기적으로는 별도의 역사/연혁 페이지나 연표 컴포넌트로 분리하는 편이 좋습니다.",
        ],
      },
      {
        title: "공식 채널",
        bullets: [
          {
            label: "네이버 블로그",
            description: "운영 중인 공식 블로그 채널입니다. 외부 채널은 메인 헤더가 아니라 보조 유틸리티에서 접근하는 편이 안정적입니다.",
            href: "https://blog.naver.com/aakorea_official",
          },
          {
            label: "YouTube",
            description: "공식 영상 채널입니다. 큰 로고 배너 대신 텍스트 기반 채널 링크로 정리하는 방향을 기본으로 삼습니다.",
            href: "https://www.youtube.com/@aakorea1935",
          },
        ],
        paragraphs: [
          "카카오톡 플러스친구는 현재 운영 체계가 분명하지 않으므로, 리뉴얼 초기에는 전면 노출보다 후순위 검토 대상으로 두는 편이 좋습니다.",
        ],
      },
    ],
    ctas: [
      { label: "팩트 파일 보기", to: "/resources/fact-file", tone: "primary" },
      { label: "도서·문헌 소개", to: "/library", tone: "secondary" },
    ],
    relatedKeys: ["factFile", "literature", "events", "gso"],
  },
  factFile: {
    key: "factFile",
    path: "/resources/fact-file",
    menuLabel: "A.A.에 관한 사실들",
    eyebrow: "A.A. Fact File",
    title: "A.A.에 관한 사실들",
    summary:
      "레거시 `assets.html`의 `A.A. FACT FILE`을 바탕으로, 가족·전문가·기관 관계자도 신뢰 가능한 참조 자료로 읽을 수 있게 다시 정리했습니다.",
    featuredLinks: [
      {
        to: "/about",
        label: "A.A. 소개",
        description: "입문형 안내와 처음 읽는 사람을 위한 소개 페이지로 이동합니다.",
      },
      {
        to: "/about/professionals",
        label: "전문가 안내",
        description: "전문가와 기관 관계자를 위한 협조 범위와 문의 경로를 확인합니다.",
      },
      {
        to: "/library",
        label: "도서·문헌 소개",
        description: "팩트 파일에서 언급된 주요 문헌과 소책자를 이어서 살펴볼 수 있습니다.",
      },
      {
        to: "/resources",
        label: "자료실 허브",
        description: "지역연합, 역사, 공식 링크를 포함한 자료 허브로 돌아갑니다.",
      },
    ],
    sections: [
      {
        title: "팩트 파일이 다루는 범위",
        bullets: [
          "익명의 알코올중독자들이란 무엇인가",
          "멤버십과 자립 원칙",
          "12전통과 회복 프로그램",
          "A.A.와 알코올중독의 관계",
          "익명성의 의미",
          "공개모임과 비공개모임",
          "회계정책과 자립",
          "탄생과 성장, 미디어 자료",
        ],
      },
      {
        title: "A.A.란 무엇인가?",
        paragraphs: [
          "원문은 A.A.를 '공동문제를 해결하고 다른 사람들이 알코올중독으로부터 회복되도록 서로의 경험과 힘과 희망을 나누는 남녀들의 모임'으로 설명합니다.",
          "가입비가 없고 자발적 기부로 자립하며, 특정 종교·정치·조직과 동맹하지 않고, 술을 마시지 않으며 다른 알코올중독자가 술을 끊도록 돕는 것을 근본 목적으로 삼는다는 점이 핵심입니다.",
        ],
      },
      {
        title: "A.A.가 지키는 원칙",
        bullets: [
          "술을 끊겠다는 열망이 멤버가 되기 위한 유일한 조건입니다.",
          "외부 기부금 없이 자립을 지향합니다.",
          "다른 기관과 협력할 수는 있지만 동맹을 맺지는 않습니다.",
          "공공 홍보보다 본래의 매력과 익명성 원칙을 중시합니다.",
          "개인보다 A.A.의 원칙과 공동 복리를 앞세웁니다.",
        ],
      },
      {
        title: "모임과 회복 프로그램",
        paragraphs: [
          "팩트 파일은 공개모임과 비공개모임을 구분해 설명하고, 12단계 중심의 회복 프로그램이 개인의 회복과 그룹의 단합을 함께 지탱한다고 말합니다.",
          "공개모임은 가족과 친구, 이해관계자에게도 열릴 수 있고, 비공개모임은 알코올중독 당사자에게 초점을 둔다는 점을 함께 보여주는 것이 중요합니다.",
        ],
      },
      {
        title: "익명성과 자립",
        paragraphs: [
          "원문은 익명성을 초심자가 안심하고 도움을 요청할 수 있게 하는 보호 장치이자, 개인의 명성보다 원칙을 앞세우게 하는 영적 기반으로 설명합니다.",
          "회계정책 역시 같은 맥락에서 자립을 강조하며, 외부 재정 지원에 의존하지 않는 전통을 분명히 합니다.",
        ],
      },
      {
        title: "역사와 오디오·비디오 자료",
        paragraphs: [
          "`assets.html`에는 미국/캐나다 기준의 장기 연표와 오디오·비디오 자료 섹션도 함께 들어 있습니다.",
          "basic 구현에서는 전체 연표를 그대로 늘어놓기보다, 한국 A.A. 역사와 국제 역사 자료를 구분하고 미디어 자료는 별도 공개 자료 유형으로 확장할 여지를 남기는 편이 좋습니다.",
        ],
      },
    ],
    ctas: [
      { label: "전문가 안내", to: "/about/professionals", tone: "primary" },
      { label: "도서·문헌 소개", to: "/library", tone: "secondary" },
    ],
    relatedKeys: ["resources", "about", "questions44", "literature"],
  },
  literature: {
    key: "literature",
    path: "/library",
    menuLabel: "도서·자료실",
    eyebrow: "Books & Pamphlets",
    title: "도서·문헌 소개",
    summary:
      "레거시 `books.html`의 주요 도서와 소책자 소개를 basic 공개 카탈로그로 다시 정리했습니다. 각 문헌의 성격을 먼저 이해한 뒤, 필요하면 스토어로 이어질 수 있도록 설계했습니다.",
    featuredLinks: [
      {
        to: "/store",
        label: "스토어로 이동",
        description: "실제 판매 흐름과 주문은 store 도메인에서 처리합니다.",
      },
      {
        to: "/resources/fact-file",
        label: "A.A.에 관한 사실들",
        description: "문헌 소개와 함께 읽기 좋은 공식 참조 문서를 확인합니다.",
      },
      {
        to: "/about/44-questions",
        label: "44가지 질문들",
        description: "책자 소개와 연결되는 대표 입문 자료를 웹에서 먼저 읽을 수 있습니다.",
      },
      {
        to: "/gso#contact-info",
        label: "구매 문의",
        description: "현재 구매 문의와 공식 연락 창구는 사무국 안내로 연결하는 방식이 가장 안전합니다.",
      },
    ],
    sections: [
      {
        title: "이 페이지의 역할",
        paragraphs: [
          "원 사이트의 `books.html`은 가격과 장바구니보다 문헌의 성격과 내용을 길게 설명하는 페이지였습니다.",
          "그래서 basic에서는 이 페이지를 공개 카탈로그로 보고, 구매가 필요한 경우에만 `store`로 이동시키는 구조가 가장 자연스럽습니다.",
        ],
      },
      {
        title: "주요 도서",
        bullets: [
          {
            label: "익명의 알코올중독자들 (Alcoholics Anonymous)",
            description: "1939년 발간된 기본 교본의 한글판으로, 회복 프로그램과 초기 멤버들의 경험담이 함께 실린 핵심 도서입니다.",
          },
          {
            label: "12단계 12전통",
            description: "개인의 회복과 그룹의 기능을 지탱하는 12단계와 12전통을 더 깊게 다루는 책입니다.",
          },
          {
            label: "온전한 생활 (Living Sober)",
            description: "술을 끊는 것에서 더 나아가 온전한 정신의 생활이 무엇인지 실천적으로 다루는 책입니다.",
          },
          {
            label: "매일의 명상 (Daily Reflections)",
            description: "날짜별 묵상 구조를 가진 책으로, 여러 문헌의 인용과 멤버들의 명상 글을 함께 읽을 수 있습니다.",
          },
          {
            label: "에즈 빌 씨즈 잇 (As Bill Sees It)",
            description: "빌의 글과 발췌문을 묶어 개인 명상과 그룹 토론에 쓰기 좋은 형식으로 정리한 책입니다.",
          },
        ],
      },
      {
        title: "소책자와 팜플렛",
        bullets: [
          {
            label: "44가지 질문들",
            description: "A.A.에 관해 자주 묻는 질문을 입문자 친화적으로 정리한 대표 소책자입니다.",
          },
          {
            label: "만약 여러분이 전문가라면",
            description: "전문가 집단과 협력하는 A.A.의 태도와 안내 범위를 설명합니다.",
          },
          {
            label: "알코올 이외의 문제점들",
            description: "약물중독 등 알코올 외 문제와 A.A.의 목적의 단일성을 함께 다룹니다.",
          },
          {
            label: "징검다리",
            description: "치료시설과 A.A. 그룹 사이의 연결 프로그램을 설명하는 안내서입니다.",
          },
          {
            label: "A.A. 그룹",
            description: "그룹 운영과 역할을 이해하는 데 도움이 되는 휴대형 안내서입니다.",
          },
          {
            label: "A.A.란 무엇인가?",
            description: "짧은 입문형 소개 자료로, 초심자와 가족이 가장 먼저 읽기 좋습니다.",
          },
          {
            label: "비 A.A. 모임에서 이야기하기",
            description: "외부 기관이나 모임에서 A.A.를 소개해야 할 때의 원칙을 다룹니다.",
          },
          {
            label: "청소년과 A.A.",
            description: "젊은 연령대의 음주 문제와 회복 경험을 다룬 자료입니다.",
          },
          {
            label: "새로 나온 사람들이 알고 싶은 것",
            description: "처음 A.A.에 온 사람이 가장 자주 묻는 질문을 모은 팜플렛입니다.",
          },
          {
            label: "여성을 위한 A.A.",
            description: "여성 음주와 회복 경험을 다루는 안내 자료입니다.",
          },
          {
            label: "익명의 이해",
            description: "익명성의 전통과 의미를 간결하게 설명하는 소책자입니다.",
          },
          {
            label: "치료시설에서의 A.A.",
            description: "치료기관 안팎에서 메시지 전달을 어떻게 해야 하는지 설명합니다.",
          },
          {
            label: "후원활동에 관한 질문과 답",
            description: "후원관계의 의미와 실제 운영 방식을 문답형으로 설명합니다.",
          },
          {
            label: "A.A. 포켓북",
            description: "서문, 12단계와 12전통, 기도문 등을 담은 휴대용 포켓북입니다.",
          },
        ],
      },
      {
        title: "읽기 목적에 따라 고르기",
        bullets: [
          "처음 오는 사람: `A.A.란 무엇인가?`, `44가지 질문들`, `새로 나온 사람들이 알고 싶은 것`",
          "가족과 친구: `44가지 질문들`, `A.A.란 무엇인가?`, `여성을 위한 A.A.`",
          "전문가: `만약 여러분이 전문가라면`, `비 A.A. 모임에서 이야기하기`, `치료시설에서의 A.A.`",
          "기존 멤버와 그룹 봉사자: `12단계 12전통`, `A.A. 그룹`, `후원활동에 관한 질문과 답`",
        ],
      },
      {
        title: "구매와 문의",
        paragraphs: [
          "원 사이트는 현재 A.A. 도서를 한국연합에서 구매할 수 있으며 전화 문의를 통해 연결된다고 안내하고 있습니다.",
          "리뉴얼 구조에서는 문헌 소개는 basic 공개 카탈로그로 유지하고, 실제 상품·재고·주문은 `store` 도메인에서 처리하는 흐름이 가장 명확합니다.",
        ],
      },
    ],
    ctas: [
      { label: "스토어로 이동", to: "/store", tone: "primary" },
      { label: "사무국 문의", to: "/gso#contact-info", tone: "secondary" },
    ],
    relatedKeys: ["resources", "factFile", "about", "events"],
  },
};
