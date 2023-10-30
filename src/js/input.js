import { localStorageObject } from '../js/app-test.js';

let localStorageBox;
let index;
let localStorageArray = [];


export function initPrint(i) {
  index = i;
  // app-test.js에서 먼저 localStorage에 'data'라는 값이 없다면 오브젝트 배열을 set해주고 있으면 return 하는 식으로 하여서 initPrint안에서  localStorage에 'data'값이 있거나 없거나라는 조건 식을 사용해 줄 필요가 없다.

  localStorageBox = getLocalStorageData(index);
  localStorageArray = localStorageBox[index];
  // datas의 i값(keym)의  value값(array)이 없다면 return 아니면 render()
  if (localStorageArray === null || localStorageArray === undefined) return;


  render(index);
}
                  // default로 currentPage= 1 함
function render(i, currentPage = 1) {
  
  const datas = getLocalStorageData(i);

  localStorageArray = datas[i];

  grantedId(localStorageArray);
  if (localStorageArray <= 0) return printingTemplate(localStorageArray);

  const pageCount = 3; // 화면에 나타날 페이지 갯수
  const commentsCount = 3; //한 페이지당 나타낼 댓글 갯수
  let totalCount = localStorageArray.length;

  let totalPage = Math.ceil(totalCount / commentsCount); // 전체 페이지 수 - '5'개 씩 끊은것
  let pageGroup = Math.ceil(currentPage / pageCount); // 보일 페이지네이션 버튼 그룹 - '5'개씩 그룹화 함 ->현재 페이지가 몇번째 그룹에 속해있는지를 알아야 현재 페이지 그룹 상의 첫번째 숫자와 마지막 숫자를 구할 수 있습니다.
  // totalPage가 14개이고 보일 내용이 5개라고 한다면 user가 보는 마지막 버튼의 숫자 이다.
  let last = pageGroup * pageCount;

  // user가 '현재'보는 마지막 숫자의 예외 처리임.
  // totalPage가 14개라 할 때 pageGroup은 총 3개중 마지막 3번째 이면 last값이 15로 버튼이 15번까지 over 될 수 있기 때문이다.
  if (last > totalPage) last = totalPage;

  // user가 '현재'보는 댓글 목록 버튼의 첫번째이다.
  let first = last - (pageCount - 1) <= 0 ? 1 : last - (pageCount - 1);
  let next = last + 1;
  let prev = first - 1;
  // 여기에 페이지 element넣어줘서 한번에 append 해버릴꺼임
  const fragmentPageBtnContainer = document.createDocumentFragment();

  const fragmentPageContentContainerItems = [];
  if (prev > 0) {
    const beginStartBtn = document.createElement('button');
    beginStartBtn.setAttribute('class', 'button');
    beginStartBtn.dataset.pageNum = 'allprev';
    beginStartBtn.innerHTML = `&lt;&lt;`;

    const preBtn = document.createElement('button');
    preBtn.setAttribute('class', 'button');
    preBtn.dataset.pageNum = 'prev';
    preBtn.innerHTML = `&lt;`;

    fragmentPageBtnContainer.appendChild(beginStartBtn);
    fragmentPageBtnContainer.appendChild(preBtn);
  }

  for (let i = first; i <= last; i++) {
    const pagingBtn = makePagingBtn(i);
    fragmentPageBtnContainer.appendChild(pagingBtn);
  }

  if (last < totalPage) {
    const endPageBtn = document.createElement('button');
    endPageBtn.setAttribute('class', 'button');
    endPageBtn.classList.add('next');
    endPageBtn.dataset.pageNum = 'endPage';
    endPageBtn.innerHTML = `&gt;&gt;`;

    const nexPageBtn = document.createElement('button');
    nexPageBtn.setAttribute('class', 'button');
    nexPageBtn.classList.add('next');
    nexPageBtn.dataset.pageNum = 'next';
    nexPageBtn.innerHTML = `&gt;`;
    fragmentPageBtnContainer.appendChild(nexPageBtn);
    fragmentPageBtnContainer.appendChild(endPageBtn);
  }
  pagingRenderBtn(fragmentPageBtnContainer, currentPage);

  for (
    let i = (currentPage - 1) * commentsCount;
    i < (currentPage - 1) * commentsCount + commentsCount && i < totalCount; // i<totalCount를 넣어준 이유는 글전체 내용보다는 넘치지 않아야하므로
    i++
  ) {
    fragmentPageContentContainerItems.push(localStorageArray[i]);
  }
  printingTemplate(fragmentPageContentContainerItems);
  pagingBtnEvent(next, prev, totalPage);
}

function pagingBtnEvent(next, prev, totalPage) {
  const $pagingBtnContainer = document.querySelector('.buttons');
  let selectedType;

  const type = {
    next: next,
    prev: prev,
    allprev: 1,
    endPage: totalPage,
  };
  Array.prototype.forEach.call($pagingBtnContainer.children, button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      for (let i = 0; i < $pagingBtnContainer.children.length; i++) {
        $pagingBtnContainer.children[i].classList.remove('active');
      }

      const dispatchData = this.getAttribute('data-page-num');
      this.classList.add('active');

      // 나중에 refactoring 해보자
      if (!!type[dispatchData]) selectedType = type[dispatchData];
      else {
        selectedType = dispatchData;
      }
      render(index, selectedType);
    });
  });
}

function makePagingBtn(number) {
  const button = document.createElement('button');
  button.classList.add('button');
  button.dataset.pageNum = number;
  button.innerText = number;
  // 페이지네이션의 숫자 버튼 누른 것을 active 해주기 위해-function pagingRenderBtn에 있음
  button.setAttribute('name', number);

  return button;
}

function pagingRenderBtn(makedBtns, currentPage) {
  const $pagingBtnContainer = document.querySelector('.buttons');
  // 일딴 buttonContainer의 요소가 있건 없건 없애주자
  while ($pagingBtnContainer.hasChildNodes()) {
    $pagingBtnContainer.removeChild($pagingBtnContainer.lastChild);
  }
  $pagingBtnContainer.appendChild(makedBtns);

  // 페이지네이션의 숫자 버튼 누른 것을 active 해주기 위해
  $pagingBtnContainer.children.namedItem(`${currentPage}`).classList.add('active');
}

// 댓글 등록하기
export function addCommentFunc(event) {
  const $commentText = document.querySelector('.comment-text.add-comment');
  event.preventDefault();
  const $userName = document.querySelector('.input-name');
  const $userPwd = document.querySelector('.input-pwd');

  // 불합격하면 반환
  if (!isValidateInfo($userName, $userPwd, $commentText)) return;
  printingComment($userName, $userPwd, $commentText);
}

function isValidateInfo(name, pwd, text) {
  if (
    name.value !== '' &&
    pwd.value.length == 4 &&
    pwd.value !== '' &&
    !isNaN(pwd.value) && // pwd.value가 0000 이면 안먹음 =>!!Number(pwd.value) 따라서 !isNaN함수로 대체함
    text.value !== ''
  )
    return true;

  return false;
}

function printingComment(name, pwd, text) {
  const $form = document.querySelector('.input-container');
  const today = commentDate();

  setGetLocalStorage(name, pwd, text, today);

  render(index);
  $form.reset();
}

function commentDate() {
  const today = new Date();
  const notationOptions = {
    month: 'long',
    day: 'numeric',
  };
  return today.toLocaleDateString('ko-KR', notationOptions);
}

// localStorage에 저장하고 얻어오기 <- form event 때문임;;
function setGetLocalStorage(name, pwd, text, today) {
  const info = {
    pwd: pwd.value,
    name: name.value,
    text: text.value,
    date: today,
  };

  // deleteEventFunc 때문에 추가한 조건문
  if (Object.keys(info).length === 0) return alert('다 채워넣자');

  
  localStorageArray.unshift(info);
  //id 부여해줘야 나중에 delete, edit 해주려고
  const newLocalStorageArray = grantedId(localStorageArray);
 
  console.log(localStorageBox)
  console.log(localStorageBox[index])
  localStorageBox[index] = newLocalStorageArray;
  const newLocalStorageObject = localStorageBox;

  const convertJson = JSON.stringify(newLocalStorageObject);
  localStorage.setItem('data', convertJson);

  // globe 변수 localStorageArray를 리턴함
  return getLocalStorageData();
}

// 처음 브라우저 열었을 때 값 받아와서 그려줘야 하니까 getLocalStorageData 함수로 따로 뺌
function getLocalStorageData(i) {
  let getData = JSON.parse(localStorage.getItem('data'));

  if(getData === null || getData === undefined) return 
 
  localStorageBox = getData;// 계속해서 최신화 하기 위해 일부러 localStorageBox =  getData라고 해주기 위함
    

    localStorageArray = getData[i];
    // getData[i]한 배열의 값이 없다면(당연히 댓글 쓰기 전 초기 값이겠지?) 그냥 231에서 참조형태로 변수에 담은 localStorageBox(object배열)만 return 시킨다.
  if (localStorageArray === null || localStorageArray === undefined) return localStorageBox;

  // localStorageArray에 배열(댓글들이 저장되어있으면) 요소가 있으면 id값 부여해서 localStorageBox의 n번째 배열(댓글 모음집)을 다시 참조형태로 부여한다.
  const idGrantedLocalStorageArray = grantedId(localStorageArray);
  localStorageBox[i] = idGrantedLocalStorageArray;

  return localStorageBox;
}

function setLocalStorage(data) {
  // 수정해야함
  const convertJson = JSON.stringify(data);
  localStorage.setItem('data', convertJson);
  
}

// 실질적으로 local에서 받아와서 뿌리는 함수임
function printingTemplate(info) {
  // 수정해야함
  const $commentContainer = document.querySelector('#comment');
  $commentContainer.innerHTML = '';

  info.forEach((data, i) => {
    // data-edit 값을 페이지 네이션작업 후 다시 넣었는데 이유는 수정버튼을 눌렀을 때 다시 localStorageArray의 값은
    const template = `
        <li class="comment-container">
        <div class="comment-view">
          <div class="comment-view-container">
            <div class="comment-info">
              <div class="comment-info_firstName">${data.name[0]}</div>
              <div class="comment-info_fullInfo">
                <span class="fullName">${data.name}</span>
                <div class="comment-date">${data.date}</div>
              </div>
              <div class="comment-func_container" data-id =${data.id} data-edit =${i}>
              </div>
            </div>
            <div class="comment-text_container">
              <div class="comment-text">${data.text}</div>
            </div>
          </div>
        </div>
      </li>
        `;
    $commentContainer.insertAdjacentHTML('beforeend', template);
  });

  // delete,edit은 따로 이벤트 등록해주려고 따로 뺌..... (사실 내 능력 부족..)
  let $commentFuncContainer = document.querySelectorAll('.comment-func_container');
  $commentFuncContainer.forEach((target, i) => {
    const deleteSpanTag = createCommentDeleteTag();
    const editSpanTag = createCommentEditTag();
    target.append(editSpanTag);
    target.append(deleteSpanTag);
  });
}

// EditButton 관련 함수들 Start ---------------

function createCommentEditTag(commentArray) {
  const editSpan = document.createElement('span');
  const editIcon = '<i class="fa-solid fa-pen"></i>';
  editSpan.setAttribute('class', 'comment-edit_container');
  editSpan.innerHTML = editIcon;

  editSpan.addEventListener('click', editPrintingHtml);
  return editSpan;
}

function editPrintingHtml(event) {
  const checkPwd = prompt('비번입력하쇼');
  const id = this.parentElement.dataset.id;

  const targetLocalStorageIndex = localStorageArray.findIndex((target, i) => {
    return target.pwd === checkPwd && target.id === id;
  });
  // 비번 틀리면  관둬야지...
  if (targetLocalStorageIndex === -1) return alert('틀림');
  // 아래 'targetedLocalStorageData'이라는 변수까지가 localStorage에서 받아온 배열에서 원하는 요소의 index 찾기 로직이다. 이 인덱스를 찾아서 template에 집어 넣는다.
  const targetedLocalStorageData = localStorageArray[targetLocalStorageIndex];

  // 페이지네이션하면서 브라우저에 보여지는 갯수가 5개로 제한 되었다 따라서 function printingTemplate에서 그려줄 때 data-edit를 넣어주어 edit 버튼을 눌렀을 때 data-edit의 number와 같은 '현재' 브라우저에 보여지는 comment를 찾아 주기 로직이다.
  const findingEditNumberName = this.parentElement.dataset.edit;
  const findedEditCommentContainerIndex = [...document.querySelectorAll('.comment-container')].findIndex(
    (parent, i) => {
      const target = parent.querySelector('.comment-func_container');
      return target.getAttribute('data-edit') == findingEditNumberName;
    },
  );

  const findedEditCommentContainer = document.querySelectorAll('.comment-container')[findedEditCommentContainerIndex];
  const template = `
    <li class="comment-container">
    <div class="comment-view">
      <div class="comment-view-container">
        <div class="comment-info">
          <div class="comment-info_firstName">
          ${targetedLocalStorageData.name[0]}
          </div>
          <div class="comment-info_fullInfo">
            <div class="comment-date">
            ${targetedLocalStorageData.date}
            </div>
          </div>
        </div>

      </div>
    </div>
  </li>
    `;

  const editForm = cretaeCommentUpdateForm(targetLocalStorageIndex);
  findedEditCommentContainer.innerHTML = template;

  findedEditCommentContainer.children[0].children[0].append(editForm); // textarea로 바꿔주는 최종 작업

  // 수정시 textarea의 value값을 기존 value 값으로 보여주는 코드
  let textAreaPreValue = findedEditCommentContainer.children[0].children[0].children[1].children[1];
  textAreaPreValue.value = targetedLocalStorageData.text;
}

// EditButton 관련 함수들 End ---------------

// updateForm 함수들 Start ----------

function cretaeCommentUpdateForm(index) {
  const updateForm = document.createElement('form');
  updateForm.classList.add('comment-text_container');
  updateForm.classList.add('update-text');

  const updateButton = document.createElement('button');
  const updateIcon = '<i class="fa-solid fa-arrow-up"></i>';
  updateButton.setAttribute('class', 'update-btn');
  updateButton.setAttribute('type', 'submit');
  // 버튼 활성화도 시키는 이벤트는 다음번에 만들자
  updateButton.innerHTML = updateIcon;

  const updateTextarea = `
    <textarea
            type="text" placeholder="댓글을 수정문의"
            onfocus="this.placeholder=''"
            onblur="this.placeholder='댓글을 수정해볼까'"
            class="comment-text update-text"
            oninput='this.style.height = ""; this.style.height = this.scrollHeight + "px"'
          ></textarea>
    `;

  updateForm.append(updateButton);
  updateForm.insertAdjacentHTML('beforeend', updateTextarea);
  updateForm.addEventListener('submit', function (e) {
    e.preventDefault();
    updateEvent(this, index);
  });
  return updateForm;
}

const updateEvent = (targetForm, i) => {
  const $pagingBtnContainer = document.querySelector('.buttons');
  // 걍 editButton 누르면 생성된 textarea의 value임
  const validatedTargetText = targetForm.children[1].value;

  // 수정 후 현재 currentPage에 그대로 있기 위한 Logic임
  const convertFindingBtn = [...$pagingBtnContainer.children];
  const findingCurrentPage = convertFindingBtn.filter(target => {
    return target.classList.contains('active');
  });

  const currentPage = findingCurrentPage[0].innerText;

  if (validatedTargetText.trim() === '') {
    render(index, currentPage);
    return;
  }

  localStorageArray[i].text = validatedTargetText;
  localStorageBox[index] = localStorageArray;
  setLocalStorage(localStorageBox);
  render(index, currentPage);
};

// Delete 관련 함수들 Start---------------

function createCommentDeleteTag() {
  const deleteSpan = document.createElement('span');
  const deleteIcon = '<i class="fa-solid fa-trash"></i>';
  deleteSpan.setAttribute('class', 'comment-delte_container');
  deleteSpan.innerHTML = deleteIcon;

  deleteSpan.addEventListener('click', deleteEventFunc);
  return deleteSpan;
}

function deleteEventFunc(event) {
  const $commentContainer = document.querySelector('#comment');
  const $pagingBtnContainer = document.querySelector('.buttons');
  const checkPwd = prompt('비번입력하쇼');
  const id = this.parentElement.dataset.id;
  const targetLocalStorageIndex = localStorageArray.findIndex((target, i) => {
    return target.pwd === checkPwd && localStorageArray[i].id === id;
  });
  // 비번 틀리면  관둬야지...
  if (targetLocalStorageIndex === -1) return alert('틀림');

  // 비번안틀리면 이 아래 코드 실행해서 삭제 해주고 다시 그려주자
  deleteEvent(this, 'click', deleteEventFunc); // deleteEvent
  deleteEvent(this, 'click', editPrintingHtml); // eidtEvent
  localStorageArray.splice(targetLocalStorageIndex, 1);

  // id다시 부여해줘야지 -> 삭제 했으니까 짜식아!!!!
  const newLocalStorageArray = grantedId(localStorageArray);
  localStorageBox[index] = newLocalStorageArray;
  setLocalStorage(localStorageBox);

  const convertFindingBtn = [...$pagingBtnContainer.children];
  const findingCurrentPage = convertFindingBtn.filter(target => {
    return target.classList.contains('active');
  });

  const currentPage = findingCurrentPage[0].innerText;
  // 4번 버튼에서 요소가 하나 있는데, 그걸 삭제하면 그 이전 페이지로 다시 그려주는 예외 처리까지 겸한 코드
  $commentContainer.children.length <= 1 ? render(index, currentPage - 1) : render(index, currentPage);
}

function deleteEvent(target, eventType, funcName) {
  target.removeEventListener(eventType, funcName);
}

// Delete 관련 함수들 End-----------------

// id 값 부여 하기
export function grantedId(array) {
  array.forEach((data, i) => {
    data.id= `${i}`;
  });
  return array;
}
// export { initPrint, addCommentFunc, printingComment };
