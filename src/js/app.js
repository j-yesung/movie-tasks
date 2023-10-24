let jsonObj = new Array();
const $logo = document.querySelector('header');
const $searchInput = document.querySelector('#search-input');
const $searchBtn = document.querySelector('.icon');
const $container = document.querySelector('.container');

const imagesUrl = 'https://image.tmdb.org/t/p/w500/';
const checkText = new RegExp(/\s/g);
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZmNmNmNhMjRmNmE5ZmUzMzhjZDYzZDM0ZjFiNTkwNyIsInN1YiI6IjY1MmYyOTEzY2FlZjJkMDBlMjhkMzk4OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HK_kH2xDe0X0L2HxwwO8e4qMFM1FatYUcnjt-nYOeGA',
  },
};

// TMDB API
async function getMovieList() {
  let data = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options).then(response =>
    response.json(),
  );

  jsonObj = data.results.map(item => {
    const $divCard = document.createElement('div'); // 부모 노드
    const $divContent = document.createElement('div'); // 자식 노드
    const $title = document.createElement('h2'); // 제목
    const $content = document.createElement('p'); // 내용
    const $grade = document.createElement('small'); // 평점

    // 클래스 추가
    $divCard.classList.add('card');
    $divContent.classList.add('content');
    $title.classList.add('title');
    $content.classList.add('description');

    // 텍스트 추가
    $title.textContent = `${item.title}`;
    $content.textContent = `${item.overview}`;
    $grade.textContent = `${item.vote_average}`;

    // 부모 노드 밑에 자식 노드로 추가
    $divCard.appendChild($divContent);
    $divContent.appendChild($title);
    $divContent.appendChild($content);
    $divContent.appendChild($grade);
    $container.appendChild($divCard);
    $searchInput.focus();

    $divCard.addEventListener('click', function () {
      alert(`영화 ID : ${item.id}`);
    });

    return item;
  });

  await startLoding(jsonObj);

  return jsonObj;
}

// 백그라운드 이미지 교체
async function startLoding(obj) {
  // 백그라운드 이미지 ::brfore에 넣어주려면 이 방법 밖에 없는 거 같다.
  let style = document.createElement('style');

  obj.forEach((item, index) => {
    style.innerHTML += `.card:nth-child(${index + 1})::before { background-image: url(${
      imagesUrl + item.backdrop_path
    }); }`;
    document.head.appendChild(style);
  });
}

// 검색 기능
async function searchTitle() {
  if ($searchInput.value === '') return alert('제목을 입력해 주세요.');

  const res = await getMovieList();
  const $card = document.querySelectorAll('.card');
  const $style = document.querySelector('style');
  let count = 0;

  $style.innerText = ''; // style 태그 내부 속성 삭제

  res.forEach((searchItem, index) => {
    let serachText = searchItem.title.toUpperCase();

    if (serachText.replace(checkText, '').indexOf($searchInput.value.replace(checkText, '').toUpperCase()) === -1) {
      $card[index].remove();
    } else {
      // style 다시 추가
      $style.innerHTML += `.card:nth-child(${(count += 1)})::before { background-image: url(${
        imagesUrl + searchItem.backdrop_path
      }); }`;
      document.head.appendChild($style);
    }
  });
  $searchInput.value = '';
}

$searchBtn.addEventListener('click', () => {
  // 컨테이너 안 요소 확인하고 없으면 바로 함수 실행
  if ($container.children.length === 0) {
    searchTitle();
    // 있으면 전부 삭제후 함수 실행
  } else {
    document.querySelectorAll('.card').forEach(item => {
      item.remove();
    });
    searchTitle();
  }
});
$searchInput.addEventListener('change', () => {
  $searchBtn.click();
});
$logo.addEventListener('click', () => {
  window.location.reload();
});

getMovieList();
