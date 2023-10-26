const $modalContainer = document.getElementById('modalContainer');
const $modalContent = document.getElementById('modalContent');

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
export async function createModal(modalData) {
  const $cardInfo = document.querySelectorAll('.card');

  $cardInfo.forEach(item => {
    if (item.id !== 'logo') {
      item.addEventListener('click', () => {
        openModal();
        const imgSrc = item.src;
        const result = modalData.find(result => result.poster_path === imgSrc);

        $modalContent.innerHTML = ''; // 기존 내용 초기화

        if (result) {
          $modalContent.innerHTML = `
						<h3 id="modalTitle">${result.movieNm}</h3>
						<div id="movieContent">
							<img src="${result.poster_path}" />
						</div>
						<p>${formatPopulation(result.audiAcc)}</p>
						<p>${formatNumber(result.salesAcc)}</p>
						<button id="modalCloseButton"></button>
					`;
          $modalContainer.appendChild($modalContent);
        }
        // 모달 닫기
        document.getElementById('modalCloseButton').addEventListener('click', () => {
          closeModal();
        });
      });
    }
  });
}

// 모달 ON/OFF
export function closeModal() {
  const $cardOtherBtn = document.querySelectorAll('.card');

  $modalContainer.classList.add('hidden');
  $cardOtherBtn.forEach(otherItem => otherItem.classList.remove('active'));
}
function openModal() {
  $modalContainer.classList.remove('hidden');
}

/**
 * 이벤트 리스너들
 */
$modalContent.addEventListener('click', e => e.stopPropagation());
document.addEventListener('click', e => {
  if (e.target === $modalContainer) closeModal();
});
