import { initPrint, addCommentFunc } from '../js/input.js';

const $modalContainer = document.getElementById('modalContainer');
const $modalContent = document.getElementById('modalContent');

// 관객수 표기
function formatPopulation(number) {
  const formatter = Intl.NumberFormat('ko', { notation: 'compact' });
  return formatter.format(number);
}
// 매출액 표기
function formatNumber(number) {
  const formatter = Intl.NumberFormat('ko', {
    style: 'currency',
    currency: 'krw',
    notation: 'compact',
  });
  return formatter.format(number);
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
            <p>누적 관객수 : ${formatPopulation(result.audiAcc)}</p>
            <p>누적 매출액 : ${formatNumber(result.salesAcc)}</p>

            <div class="container">
              <ul id="comment"></ul>
              <div class="buttons"></div>
            </div>

            <form class="input-container">
              <div class="user-info-container">
                <input
                  type="text"
                  placeholder="실명제 합시다"
                  maxlength="8자리"
                  onfocus="this.placeholder=''"
                  onblur="this.placeholder='실명제합시다'"
                  class="input-name"
                />
                <input
                  type="password"
                  placeholder="비번 4자리 하자"
                  maxlength="4"
                  onfocus="this.placeholder=''"
                  onblur="this.placeholder='윤하의 486(0)'"
                  class="input-pwd"
                />
              </div>

              <textarea
                type="text"
                class="comment-text add-comment"
                placeholder="댓글을 써볼까?"
                oninput='this.style.height = ""; this.style.height = this.scrollHeight + "px"'
                onfocus="this.placeholder=''"
                onblur="this.placeholder='댓글을 써볼까?'"
              ></textarea>
              <button type="submit" class="form-btn">
                <i class="fa-solid fa-arrow-up"></i>
              </button>
            </form>

            <button id="modalCloseButton"></button>
          `;
          $modalContainer.appendChild($modalContent);
        }
        // 댓글 관련 변수 선언
        const $commentContainer = document.querySelector('#comment');
        const $form = document.querySelector('.input-container');
        const $commentText = document.querySelector('.comment-text.add-comment');
        const $formSubmitBtn = document.querySelector('.form-btn');
        const $pagingBtnContainer = document.querySelector('.buttons');

        initPrint();
        $form.addEventListener('submit', addCommentFunc);

        $commentText.addEventListener('input', e => {
          $commentText.value.trim() !== ''
            ? $formSubmitBtn.classList.add('submit')
            : $formSubmitBtn.classList.remove('submit');
        });

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
