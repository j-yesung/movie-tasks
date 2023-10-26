export { createModal };

const modalCloseButton = document.getElementById('modalCloseButton');
const modalContainer = document.getElementById('modalContainer');
const modalContent = document.getElementById('modalContent');

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

// 모달 생성
async function createModal(modalData) {
  const $cardInfo = document.querySelectorAll('.card');

  $cardInfo.forEach(item => {
    item.addEventListener('click', () => {
      openModal();
      const movieName = item.children[1].children[0].textContent;
      const result = modalData.find(result => result.movieNm === movieName);

      modalContent.innerHTML = ''; // 기존 내용 초기화

      if (result) {
        modalContent.innerHTML = `
              <h3>${result.movieNm}</h3>
              <img src="${item.children[0].getAttribute('src')}" />
              <div id="movieContent">
                <p>${formatPopulation(result.audiAcc)}</p>
                <p>${formatNumber(result.salesAcc)}</p>
              </div>
            `;
        modalContainer.appendChild(modalContent);
      }
    });
  });
}

// 모달 ON/OFF
function closeModal() {
  modalContainer.classList.add('hidden');
}
function openModal() {
  modalContainer.classList.remove('hidden');
}

// 모달 닫기
modalCloseButton.addEventListener('click', () => closeModal());
// 모달 내부를 클릭해도 모달이 닫히지 않도록 이벤트 전파 중지
modalContent.addEventListener('click', e => e.stopPropagation());
// 모달 외부 클릭 시 닫기
document.addEventListener('click', e => {
  if (e.target === modalContainer) closeModal();
});
