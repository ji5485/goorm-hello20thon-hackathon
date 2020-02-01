var today = new Date(); //오늘 날짜//내 컴퓨터 로컬을 기준으로 today에 Date 객체를 넣어줌
var date = new Date(); //today의 Date를 세어주는 역할

function prevCalendar() {
    today = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    buildCalendar(); //달력 cell 만들어 출력 
}

function nextCalendar() {
    today = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    buildCalendar();
}

function buildCalendar() { //현재 달 달력 만들기
    var doMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    var lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    var tbCalendar = document.getElementById("calendar");
    var tbCalendarYM = document.getElementById("tbCalendarYM");
    var tbCalendarYMStr = document.getElementById("tbCalendarYMStr");
    
    var curMonth = (today.getMonth() + 1);
    if (curMonth == 1) {
        tbCalendarYMStr.innerHTML = "January "+ today.getFullYear();
    } else if (curMonth == 2) {
        tbCalendarYMStr.innerHTML = "February " + today.getFullYear();
    } else if (curMonth == 3) {
        tbCalendarYMStr.innerHTML = "March "+ today.getFullYear();
    } else if (curMonth == 4) {
        tbCalendarYMStr.innerHTML = "April " + today.getFullYear();
    } else if (curMonth == 5) {
        tbCalendarYMStr.innerHTML = "May " + today.getFullYear();
    } else if (curMonth == 6) {
        tbCalendarYMStr.innerHTML = "June " + today.getFullYear();
    } else if (curMonth == 7) {
        tbCalendarYMStr.innerHTML = "July " + today.getFullYear();
    } else if (curMonth == 8) {
        tbCalendarYMStr.innerHTML = "August " + today.getFullYear();
    } else if (curMonth == 9) {
        tbCalendarYMStr.innerHTML = "September " + today.getFullYear();
    } else if (curMonth == 10) {
        tbCalendarYMStr.innerHTML = "October " + today.getFullYear();
    } else if (curMonth == 11) {
        tbCalendarYMStr.innerHTML = "November " + today.getFullYear();
    } else {
        tbCalendarYMStr.innerHTML = "December " + today.getFullYear();
    }
    /*while은 이번달이 끝나면 다음달로 넘겨주는 역할*/
    while (tbCalendar.rows.length > 1) {
        //열을 지워줌
        tbCalendar.deleteRow(tbCalendar.rows.length - 1);
        //테이블의 tr 갯수 만큼의 열 묶음은 -1칸 해줘야지 
        //30일 이후로 담을달에 순서대로 열이 계속 이어진다.
    }
    var row = null;
    row = tbCalendar.insertRow();
    //테이블에 새로운 열 삽입//즉, 초기화
    var cnt = 0; // count, 셀의 갯수를 세어주는 역할
    // 1일이 시작되는 칸을 맞추어 줌
    for (i = 0; i < doMonth.getDay(); i++) {
        /*이번달의 day만큼 돌림*/
        cell = row.insertCell(); //열 한칸한칸 계속 만들어주는 역할
        cnt = cnt + 1; //열의 갯수를 계속 다음으로 위치하게 해주는 역할
    }
    /*달력 출력*/
    for (i = 1; i <= lastDate.getDate(); i++) {
        //1일부터 마지막 일까지 돌림
        cell = row.insertCell(); //열 한칸한칸 계속 만들어주는 역할
        cell.innerHTML = i; //셀을 1부터 마지막 day까지 HTML 문법에 넣어줌
        cnt = cnt + 1; //열의 갯수를 계속 다음으로 위치하게 해주는 역할
        if (cnt % 7 == 1) {
            /*일요일 계산*/
            //1주일이 7일 이므로 일요일 구하기
            //월화수목금토일을 7로 나눴을때 나머지가 1이면 cnt가 1번째에 위치함을 의미한다
            cell.innerHTML = "<font color=#F79DC2>" + i
            //1번째의 cell에만 색칠
        }
        if (cnt % 7 == 0) {
            /* 1주일이 7일 이므로 토요일 구하기*/
            //월화수목금토일을 7로 나눴을때 나머지가 0이면 cnt가 7번째에 위치함을 의미한다
            cell.innerHTML = "<font color=skyblue>" + i
            //7번째의 cell에만 색칠
            row = calendar.insertRow();
            //토요일 다음에 올 셀을 추가
        }
        /*오늘의 날짜에 노란색 칠하기*/
        if (today.getFullYear() == date.getFullYear() &&
            today.getMonth() == date.getMonth() &&
            i == date.getDate()) {
            //달력에 있는 년,달과 내 컴퓨터의 로컬 년,달이 같고, 일이 오늘의 일과 같으면
            cell.bgColor = "#0081f8"; //셀의 배경색을 노랑으로 
        }
    }
}
