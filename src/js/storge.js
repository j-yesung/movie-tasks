// localStorge 전역으로 생성
const { setItem, getItem, removeItem, clear, length, key } = localStorage;
const idInput = document.querySelector('.id'); // id 입력 박스
const pwInput = document.querySelector('.pwd'); // pw 입력 박스
const commentInput = document.querySelector('.comment'); // 댓글 입력 박스
const sendBtn = document.querySelector('.sendData'); // form 전송

function closure() {
  let cnt = 0;

  function cntPlus() {
    cnt += 1;
    console.log(cnt);
  }
  function setValue(value) {
    cnt = value;
    console.log(cnt);
  }
  function printCnt() {
    console.log(cnt);
  }

  return {
    cntPlus,
    setValue,
    // printCnt,
  };
}

const cntClosure = closure();
// console.log(cntClosure);
// cntClosure.cntPlus();
// cntClosure.cntPlus();
// cntClosure.setValue(100);

sendBtn.addEventListener('click', e => {
  e.preventDefault(); // 새로고침 방지
  let obj = {
    id: cntClosure.cntPlus(), // 고유한 ID (index)
    valueInfo: {
      movieName: '스파이더맨',
    },
  };

  // 카드 하나 당
  // value가 객체가 되어야 함 (영화 이름)
  localStorage.setItem(JSON.stringify(obj.id), JSON.stringify(obj.valueInfo));

  idInput.value = '';
  pwInput.value = '';
  commentInput.value = '';
});
// localStorage.clear();

// 클로저 예제 코드
// #1.
const increase = (function () {
  // 카운트 상태 변수
  let num = 0;

  // 클로저
  return function () {
    return ++num;
  };
})();

// #2.
// function closure() {
//   let cnt = 0;

//   function cntPlus() {
//     cnt += 1;
//   }
//   function printCnt() {
//     console.log(cnt);
//   }

//   return {
//     cntPlus,
//     printCnt,
//   };
// }

// const cntClosure = closure();
// console.log(cntClosure);
// cntClosure.printCnt();
// cntClosure.cntPlus();
// cntClosure.printCnt();
