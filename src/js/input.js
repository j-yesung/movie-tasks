const $commentContainer = document.querySelector("#comment");
const $form = document.querySelector(".input-container");
const $commentText = document.querySelector(".comment-text.add-comment");
const $formSubmitBtn = document.querySelector(".form-btn");
let localStorageArray = [];

// 브라우저 키면 처음 그려주기
initPrint();

// 코멘트 한글자라도 있으면 버튼 활성화,댓글 하나라도 있으면 전송버튼 활성화 시켜서 UX로 알려주자 - 전역으로 해줘야징 ㅎㅎ
$commentText.addEventListener("input", (e) => {
    $commentText.value.trim() !== '' ? $formSubmitBtn.classList.add("submit") : $formSubmitBtn.classList.remove("submit");
})

// 댓글 달기
$form.addEventListener("submit", addCommentFunc);













function initPrint() {
    const datas = getLocalStorageData();
    // localStorage에 머 없으면 우짬? return 해줘야지 멀 징징거려 채문길
    if (datas === null || datas === undefined) return

    // html에 꽂아버리기
    printingTemplate(datas)
}


function addCommentFunc(event) {
    event.preventDefault();
    const $userName = document.querySelector(".input-name");
    const $userPwd = document.querySelector(".input-pwd");


    // 불합격하면 반환
    if (!isValidateInfo($userName, $userPwd, $commentText)) return;

    printingComment($userName, $userPwd, $commentText)
}

function isValidateInfo(name, pwd, text) {
    if (
        name.value !== "" &&
        pwd.value.length == 4 &&
        pwd.value !== "" &&
        !isNaN(pwd.value) &&// pwd.value가 0000 이면 안먹음 =>!!Number(pwd.value) 따라서 !isNaN함수로 대체함
        text.value !== ""
    ) return true;

    return false;
}

function printingComment(name, pwd, text) {

    const today = commentDate();
    const datas = setGetLocalStorage(name, pwd, text, today)

    printingTemplate(datas)
    $form.reset();
}

function commentDate() {
    const today = new Date();
    const notationOptions = {
        month: "long",
        day: "numeric",
    };
    return today.toLocaleDateString("ko-KR", notationOptions);
}

// localStorage에 저장하고 얻어오기 <- form event 때문임;;
function setGetLocalStorage(name, pwd, text, today) {
    const info = {
        pwd: pwd.value,
        name: name.value,
        text: text.value,
        date: today,
    }
    // deleteEventFunc 때문에 추가한 조건문
    if (Object.keys(info).length === 0) return;

    localStorageArray.unshift(info);

    //id 부여해줘야 나중에 delete, edit 해주려고
    const newLocalStorageArray = grantedId(localStorageArray);

    const convertJson = JSON.stringify(newLocalStorageArray);
    localStorage.setItem("data", convertJson);

    // globe 변수 localStorageArray를 리턴함
    return getLocalStorageData()
};


// 처음 브라우저 열었을 때 값 받아와서 그려줘야 하니까 getLocalStorageData 함수로 따로 뺌
function getLocalStorageData() {
    const getData = localStorage.getItem("data");
    if (getData === null || getData === undefined) return

    localStorageArray = JSON.parse(getData)
    const idGrantedLocalStorageArray = grantedId(localStorageArray);
    return idGrantedLocalStorageArray;
}

function setLocalStorage(data){
    const convertJson = JSON.stringify(data);
    localStorage.setItem("data", convertJson);
}


// 실질적으로 local에서 받아와서 뿌리는 함수임
function printingTemplate(info) {
    $commentContainer.innerHTML = ''
    info.forEach((data, i) => {
        const template =
            `
        <li class="comment-container">
        <div class="comment-view">
          <div class="comment-view-container">
            <div class="comment-info">
              <div class="comment-info_firstName">${data.name[0]}</div>
              <div class="comment-info_fullInfo">
                <span class="fullName">${data.name}</span>
                <div class="comment-date">${data.date}</div>
              </div>
              <div class="comment-func_container" data-id =${i}>
              </div>
            </div>
            <div class="comment-text_container">
              <div class="comment-text">${data.text}</div>
            </div>
          </div>
        </div>
      </li>
        `
        $commentContainer.insertAdjacentHTML("beforeend", template);
    })

    // delete,edit은 따로 이벤트 등록해주려고 따로 뺌..... (사실 내 능력 부족..)
    let $commentFuncContainer = document.querySelectorAll(".comment-func_container");
    $commentFuncContainer.forEach((target, i) => {
        const deleteSpanTag = createCommentDeleteTag()
        const editSpanTag = createCommentEditTag();
        target.append(editSpanTag);
        target.append(deleteSpanTag)
    })
}
// EditButton 관련 함수들 Start ---------------

function createCommentEditTag(commentArray) {
    const editSpan = document.createElement("span");
    const editIcon = '<i class="fa-solid fa-pen"></i>'
    editSpan.setAttribute("class", "comment-edit_container");
    editSpan.innerHTML = editIcon;

    editSpan.addEventListener("click", editPrintingHtml)
    return editSpan
}

function editPrintingHtml(event) {
    const checkPwd = prompt("비번입력하쇼");
    const id = this.parentElement.dataset.id;

    const targetIndex = localStorageArray.findIndex(target => {
        return target.pwd === checkPwd && target.id === id
    })
    // 비번 틀리면  관둬야지...
    if (targetIndex === -1) return
    const targetedLocalStorageData = localStorageArray[targetIndex];
  const findedEditCommentContainer = document.querySelectorAll(".comment-container")[targetIndex];

    const template = 
    `
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
    `

    const editForm = cretaeCommentUpdateForm(targetIndex)
     findedEditCommentContainer.innerHTML = template;

    findedEditCommentContainer.children[0].children[0].append(editForm);

    // 수정시 textarea의 value값을 기존 value 값으로 보여주는 코드
    let textAreaPreValue = findedEditCommentContainer.children[0].children[0].children[1].children[1];
    textAreaPreValue.value = targetedLocalStorageData.text
    
  
   
}

// EditButton 관련 함수들 End ---------------

// updateForm 함수들 Start ----------

function cretaeCommentUpdateForm(index){
    const updateForm = document.createElement("form");
    updateForm.classList.add("comment-text_container");
    updateForm.classList.add("update-text");

    const updateButton = document.createElement("button");
    const updateIcon = '<i class="fa-solid fa-arrow-up"></i>'
    updateButton.setAttribute("class","update-btn");
    updateButton.setAttribute("type","submit");
    // 버튼 활성화도 시키는 이벤트는 다음번에 만들자
    updateButton.innerHTML = updateIcon;

    const updateTextarea = 
    `
    <textarea
            type="text" placeholder="댓글을 수정문의"
            onfocus="this.placeholder=''"
            onblur="this.placeholder='댓글을 수정해볼까'"
            class="comment-text update-text"
            oninput='this.style.height = ""; this.style.height = this.scrollHeight + "px"'
          ></textarea>
    `

    updateForm.append(updateButton);
    updateForm.insertAdjacentHTML("beforeend",updateTextarea);
    updateForm.addEventListener("submit",function(e){
        e.preventDefault();
        updateEvent(this,index);
    });
    return updateForm  
}


const updateEvent =(targetForm,index)=>{
    // 걍 textarea의 value임
    const validatedTargetText = targetForm.children[1].value 
    if(validatedTargetText.trim() === '') return printingTemplate(localStorageArray);

    localStorageArray[index].text = validatedTargetText;
    setLocalStorage(localStorageArray);

    const updateLocalStorageDatas = getLocalStorageData()
    printingTemplate(updateLocalStorageDatas);
   
}

// Delete 관련 함수들 Start---------------

function createCommentDeleteTag() {
    const deleteSpan = document.createElement("span");
    const deleteIcon = '<i class="fa-solid fa-trash"></i>'
    deleteSpan.setAttribute("class", "comment-delte_container");
    deleteSpan.innerHTML = deleteIcon

    deleteSpan.addEventListener("click", deleteFunc);
    return deleteSpan
}


function deleteFunc(event) {
    const checkPwd = prompt("비번입력하쇼");
    const id = this.parentElement.dataset.id;
    const targetIndex = localStorageArray.findIndex(target => {
        return target.pwd === checkPwd && target.id === id
    })
    // 비번 틀리면  관둬야지...
    if (targetIndex === -1) return

    // 비번안틀리면 이 아래 코드 실행해서 삭제 해주고 다시 그려주자
    deleteEvent(this, "click", deleteFunc); // deleteEvent
    deleteEvent(this, "click", editPrintingHtml)// eidtEvent
    localStorageArray.splice(targetIndex, 1);

    // id다시 부여해줘야지 
    const newLocalStorageArray = grantedId(localStorageArray)
    const convertJson = JSON.stringify(newLocalStorageArray);
    localStorage.setItem("data", convertJson);


    const datas = getLocalStorageData();
    printingTemplate(datas);
}

function deleteEvent(target, eventType, funcName) {
    target.removeEventListener(eventType, funcName)
}


// Delete 관련 함수들 End-----------------

function grantedId(array) {
    array.forEach((data, i) => {
        data.id = `${i}`;
    })
    return array
}
