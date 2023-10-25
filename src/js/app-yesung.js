import { createModal } from '../js/modal.js';

const $logo = document.querySelector('header');
const $searchInput = document.querySelector('#search-input');
const $searchBtn = document.querySelector('.icon');
const $container = document.querySelector('.container');
const defaultUrl = 'https://kobis.or.kr/common/mast/movie';
const checkText = new RegExp(/\s/g);

/**
 * 객체 병합 함수
 * @returns { data1 : 이미지 경로, data2 : 영화진흥위원회 API 데이터 }
 */
async function fetchData() {
  const key = '98b425383d86d1c61535d64d720ee01e';
  const date = '20220101';
  const url1 = '../data/poster.json';
  const url2 = `http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${key}&targetDt=${date}`;
  const response1 = await fetch(url1);
  const data1 = await response1.json();

  const response2 = await fetch(url2);
  const data2 = await response2.json();

  return { data1, data2 };
}

/**
 * 영화 리스트 만들기
 * @param {*} listData fetch에서 불러온 최초 데이터
 */
async function appendMovieList(listData) {
  listData.forEach(item => {
    let divArea = `
      <div class="card">
        <img src="${defaultUrl}${item.poster_path}" width="200" height="300"/>
        <div class="content">
          <h2 class="title">${item.movieNm}</h2>
        </div>
      </div>
    `;
    $container.insertAdjacentHTML('beforeend', divArea);
  });
}
/**
 * 1. fetchData() 함수 호출 후, 리턴받은 데이터 병합 진행
 * 2. 병합한 데이터를 가지고 [영화 리스트 함수], [모달 함수], [검색 기능 이벤트 리스너] 호출
 * [해야 할 것] finalData 전역으로 빼보기
 */
fetchData()
  .then(async result => {
    const imgData = result.data1.results; // 이미지 경로가 들어 있는 배열
    const movieListData = result.data2.boxOfficeResult.dailyBoxOfficeList;
    const finalData = movieListData.map((item, index) => {
      return { ...item, poster_path: imgData[index].poster_path }; // 데이터 병합
    });

    await appendMovieList(finalData);
    await createModal(finalData);

    $searchBtn.addEventListener('click', () => searchTitle(finalData));
    $searchInput.addEventListener('change', () => $searchBtn.click()); // 엔터키 이벤트

    console.log(finalData);

    document.getElementById('sortingSelect').addEventListener('change', e => {
      if (e.target.value === '영화 제목') updateMovieList(sortByNameOrder(finalData));
      if (e.target.value === '누적 관객수') updateMovieList(sortSalesOrder(finalData));
    });
  })
  .catch(error => console.log(error));

/**
 * 영화 리스트 검색 기능
 * @param {*} searchData fetch에서 불러온 최초 데이터
 * @returns
 */
async function searchTitle(searchData) {
  if ($searchInput.value === '') return alert('제목을 입력해 주세요.');

  const $card = document.querySelectorAll('.card');

  for (let i = 0; i < $card.length; i++) {
    $card[i].style.display = 'none';
  }

  searchData.forEach((item, index) => {
    let serachText = item.movieNm.toUpperCase();

    if (serachText.replace(checkText, '').indexOf($searchInput.value.replace(checkText, '').toUpperCase()) !== -1) {
      $card[index].style.display = 'block';
    }
  });

  $searchInput.value = '';
}

/**
 * @param {*} sortData fetch에서 불러온 최초 데이터
 * @returns 이름순 정렬 (오름차순)
 */
function sortByNameOrder(sortData) {
  return sortData.sort((a, b) => a.movieNm.localeCompare(b.movieNm, 'ko-KR'));
}

/**
 * @param {*} sortData fetch에서 불러온 최초 데이터
 * @returns 누적 관객수 정렬 (내림차순)
 */
function sortSalesOrder(sortData) {
  return sortData.sort((a, b) => b.audiAcc - a.audiAcc);
}

/**
 *
 * @param {*} updateData 정렬된 데이터
 */
async function updateMovieList(updateData) {
  $container.innerHTML = ''; // HTML 컨테이너 초기화
  await appendMovieList(updateData);
  await createModal(updateData);
}

$logo.addEventListener('click', () => window.location.reload());
