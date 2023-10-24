let jsonObj = new Array();
const $logo = document.querySelector('header');
const $searchInput = document.querySelector('#search-input');
const $searchBtn = document.querySelector('.icon');
const $container = document.querySelector('.container');
const defaultUrl = 'https://kobis.or.kr/common/mast/movie';
const checkText = new RegExp(/\s/g);
// 모달 관련 태그
const modalCloseButton = document.getElementById('modalCloseButton');
const modalContainer = document.getElementById('modalContainer');
const modalContent = document.getElementById('modalContent');
const modalHeader = document.getElementById('header');
const imgBox = document.getElementById('imgBox');
const movieContent = document.getElementById('movieContent');

// 영화진흥위원회 API
async function getMovieList() {
  const KEY = '98b425383d86d1c61535d64d720ee01e';
  const DATE = '20220101';
  const data = await fetch(
    `http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${KEY}&targetDt=${DATE}`,
  ).then(response => response.json());
  const poster = await fetch('../data/poster.json').then(response => response.json());
  const promise = await new Promise((resolve, reject) => {
    jsonObj = data.boxOfficeResult.dailyBoxOfficeList.map((item, idx) => {
      let divArea = `
        <div class="card">
          <img src="${defaultUrl}${poster.results[idx].poster_path}" width="200" height="300"/>
          <div class="content">
            <h2 class="title">${item.movieNm}</h2>
          </div>
        </div>
      `;
      $container.insertAdjacentHTML('beforeend', divArea);
      return item;
    });
    resolve(jsonObj);
  });

  return promise;
}

// 검색 기능
async function searchTitle() {
  if ($searchInput.value === '') return alert('제목을 입력해 주세요.');

  const $card = document.querySelectorAll('.card');

  for (let i = 0; i < $card.length; i++) {
    $card[i].style.display = 'none';
  }

  jsonObj.forEach((searchItem, index) => {
    console.log(searchItem);
    let serachText = searchItem.movieNm.toUpperCase();

    if (serachText.replace(checkText, '').indexOf($searchInput.value.replace(checkText, '').toUpperCase()) !== -1) {
      $card[index].style.display = 'block';
    }
  });

  $searchInput.value = '';
}

// 검색 버튼 눌렀을 때, 검색 기능 함수 호출
$searchBtn.addEventListener('click', () => searchTitle());
// 영화 제목 입력하고 엔터키 눌렀을 때, searchBtn 클릭 이벤트
$searchInput.addEventListener('change', () => $searchBtn.click());
// 로고 클릭했을 때, 화면 새로고침
$logo.addEventListener('click', () => window.location.reload());

// 영화 리스트 불러오고 이벤트
getMovieList().then(res => {
  const $cardInfo = document.querySelectorAll('.card');
  const hElement = document.createElement('h3');
  const imageElement = document.createElement('img');
  const pElement1 = document.createElement('p');
  const pElement2 = document.createElement('p');

  // class="card" 노드 리스트(배열 형태) 들고 와서 forEach로 순회
  $cardInfo.forEach(item => {
    // 각 요소 클릭 시 클릭 이벤트 활성화
    item.addEventListener('click', () => {
      openModal();
      const movieName = item.children[1].children[0].textContent;
      const result = res.find(result => result.movieNm === movieName);

      if (result) {
        // 클릭할 때 마다 요소 변경
        imageElement.src = item.children[0].getAttribute('src');
        hElement.textContent = result.movieNm;
        pElement1.textContent = formatPopulation(result.audiAcc);
        pElement2.textContent = formatNumber(result.salesAcc);

        modalHeader.appendChild(hElement); // 타이틀
        imgBox.appendChild(imageElement); // 이미지
        movieContent.appendChild(pElement1); // 누적 관객수
        movieContent.appendChild(pElement2); // 누적 매출액
      }
    });
  });
});

// 모달 닫기
modalCloseButton.addEventListener('click', () => closeModal());
// 모달 외부 클릭 시 닫기
modalContent.addEventListener('click', e => e.stopPropagation());
// 모달 내부를 클릭해도 모달이 닫히지 않도록 이벤트 전파 중지
document.addEventListener('click', e => {
  if (e.target === modalContainer) closeModal();
});

// 모달 ON/OFF
function closeModal() {
  modalContainer.classList.add('hidden');
}
function openModal() {
  modalContainer.classList.remove('hidden');
}

// 관객수 표기
function formatPopulation(number) {
  if (number >= 10000000) {
    return `누적 관객수 : ${Math.round(number / 10000000)}천만명`;
  } else if (number >= 10000) {
    return `누적 관객수 : ${Math.round(number / 10000)}만명`;
  } else if (number >= 1000) {
    return `누적 관객수 : ${Math.round(number / 1000)}천명`;
  } else {
    return `누적 관객수 : ${Math.round(number)}명`;
  }
}
// 매출액 표기
function formatNumber(number) {
  if (number >= 100000000) {
    return `누적 매출액 : ${Math.round(number / 100000000)}억`;
  } else if (number >= 10000) {
    return `누적 매출액 : ${Math.round(number / 10000)}만`;
  } else {
    return `누적 매출액 : ${Math.round(number.toString())}`;
  }
}
