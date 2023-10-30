import { createModal } from "../js/modal-test.js";
const $header = document.querySelector("header");
const $container = document.querySelector(".container");
const $sortSelect = document.getElementById("sortingSelect");
const $searchInput = document.querySelector("#search-input");
const $searchBtn = document.querySelector(".icon");
const checkText = new RegExp(/\s/g);

const defaultUrl = "https://kobis.or.kr/common/mast/movie";
const key = "98b425383d86d1c61535d64d720ee01e";
const date = "20220101";
const url1 = "../data/poster.json";
const url2 = `http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${key}&targetDt=${date}`;
let finalData = [];
export let localStorageObject = {}; // localStorage의 각 배열에 담길 댓글들을 감싼 Object

/**
 * 데이터 불러오기
 * @param {*} url 불러올 url 경로
 * @returns JSON 변환
 */
async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

/**
 * 두 개의 JSON 데이터 병합하기
 * @param {*} mData fetch에서 불러온 최초 데이터
 * @returns 병합된 데이터
 */
async function mergeData(mData) {
  const [data1, data2] = mData;
  const mergedData = { data1, data2 };
  const imgData = mergedData.data1.results; // 이미지 경로가 들어 있는 배열
  const movieListData = mergedData.data2.boxOfficeResult.dailyBoxOfficeList;
  const resultData = movieListData.map((item, index) => {
    return { ...item, poster_path: defaultUrl + imgData[index].poster_path }; // 데이터 병합
  });

  return resultData;
}
/**
 * 영화 리스트 만들기
 * @param {*} listData fetch에서 불러온 최초 데이터
 */
async function appendMovieList(listData) {
  let numbers = Array.from({ length: 10 }, (_, index) => -5 + index);

  if (listData.length < 9) {
    numbers = Array.from({ length: 10 }, (_, index) => 0 + index);
    $container.insertAdjacentHTML(
      "afterbegin",
      `<img src="../images/logo.png" class="card" id="logo" style="--i: 1" />`
    );
  } else {
    $container.insertAdjacentHTML(
      "afterbegin",
      `<img src="../images/logo.png" class="card" id="logo" style="--i: 5" />`
    );
  }

  listData.forEach((item, i) => {
    let imgArea = `
      <img src="${item.poster_path}" class="card" style="--i: ${numbers[i]}" />
    `;
    $container.insertAdjacentHTML("afterbegin", imgArea);
  });
}

/**
 * 익명 즉시 실행 함수
 * 영화 리스트 및 데이터 병합 함수 호출
 */
(async function () {
  try {
    console.time("fetch load check");
    const result = await Promise.all([fetchData(url1), fetchData(url2)]);
    finalData = await mergeData(result);
    console.timeEnd("fetch load check");

    await appendMovieList(finalData);
    await createModal(finalData)
    .then(datas =>{

      // 브라우저 키자마자 조건식으로 localStorage에 '몰래' 댓글모음집 담을 데이터 셋팅 해줘서, input.js에서 localStorage에 데이터가 있느니 없느니라는 귀찮은 조건식을 안써주게 함
      if(localStorage.getItem("data")=== null || localStorage.getItem('data')=== undefined) {
        datas.forEach((el,i)=>{
          const newArray = [];
          localStorageObject[i] = newArray;
        })

        localStorage.setItem("data",JSON.stringify(localStorageObject))
      } 
    });

  } catch (error) {
    console.log("에러 발생\n", error);
  }
})();

/**
 * 영화 리스트 검색 기능
 * @param {*} searchData fetch에서 불러온 최초 데이터
 * @returns
 */
async function searchTitle(searchData) {
  if ($searchInput.value === "") return alert("제목을 입력해 주세요.");

  const $card = document.querySelectorAll(".card");
  let arr = [];

  for (let i = 0; i < $card.length; i++) {
    $card[i].style.display = "none";
  }

  searchData.forEach((item) => {
    let serachText = item.movieNm.toUpperCase();

    if (
      serachText
        .replace(checkText, "")
        .indexOf($searchInput.value.replace(checkText, "").toUpperCase()) !== -1
    ) {
      arr.push(item);
      updateMovieList(arr);
    }
  });

  $searchInput.value = ""; // input 초기화
}

/**
 * @param {*} sortData fetch에서 불러온 최초 데이터
 * @returns 이름순 정렬 (오름차순)
 */
function sortByNameOrder(sortData) {
  return sortData.sort((a, b) => a.movieNm.localeCompare(b.movieNm, "ko-KR"));
}

/**
 * @param {*} sortData fetch에서 불러온 최초 데이터
 * @returns 누적 관객수 정렬 (내림차순)
 */
function sortSalesOrder(sortData) {
  return sortData.sort((a, b) => b.audiAcc - a.audiAcc);
}

/**
 * 컨테이너 HTML 업데이트
 * @param {*} updateData 정렬된 데이터
 */
async function updateMovieList(updateData) {
  $container.innerHTML = ""; // HTML 컨테이너 초기화
  await appendMovieList(updateData);
  await createModal(updateData);
}

/**
 * 이벤트 리스너들
 */
$header.addEventListener("click", () => window.location.reload());
$container.addEventListener("mouseover", function () {
  this.classList.add("hovered");

  const $logo = document.getElementById("logo");
  const $cardBtn = document.querySelectorAll(".card");
  $cardBtn.forEach((item) => {
    item.addEventListener("click", () => {
      if (item.id !== "logo") item.classList.add("active");

      // 클릭한 대상 말고 다른 요소들은 active 클래스 제거
      $cardBtn.forEach((otherItem) => {
        if (otherItem !== item) otherItem.classList.remove("active");
      });
    });
  });

  $logo.addEventListener("click", () => $container.classList.remove("hovered"));
});
$searchBtn.addEventListener("click", () => searchTitle(finalData));
$searchInput.addEventListener("change", () => $searchBtn.click());
$sortSelect.addEventListener("change", (e) => {
  if (e.target.value === "영화 제목")
    updateMovieList(sortByNameOrder(finalData));
  if (e.target.value === "누적 관객수")
    updateMovieList(sortSalesOrder(finalData));
});
