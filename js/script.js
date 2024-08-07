document.addEventListener("DOMContentLoaded", function () {
    const datepicker = document.getElementById("datepicker");
    const calendarContainer = document.getElementById("calendar-container");
    const calendar = document.getElementById("calendar");
    const calendarTitle = document.getElementById("calendar-title");
    const prevMonthButton = document.getElementById("prev-month");
    const nextMonthButton = document.getElementById("next-month");
    const nextCalendar = document.getElementById("next-calendar");
    const nextCalendarTitle = document.getElementById("next-calendar-title");
    const monthSelect = document.getElementById("month-select");
    const changeCalenderDate = document.getElementById("change-calender-date");
  
    const jalaaliMonths = [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ];
    const gregorianMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  
    const text = {
      fa: {
        changeMonth: "تغییر زبان",
        prevMonth: "قبلی",
        nextMonth: "بعدی",
        showCurrentMonth: "نمایش ماه فعلی",
        showCurrentAndNextMonth: "نمایش ماه فعلی و ماه آینده",
      },
      en: {
        changeMonth: "Change lng",
        prevMonth: "Previous",
        nextMonth: "Next",
        showCurrentMonth: "Show Current Month",
        showCurrentAndNextMonth: "Show Current and Next Month",
      },
    };
  
    let currentDate = new Date();
    let currentLanguage = "fa";
  
    function updateCalendar() {
      if (typeof jalaali !== "undefined") {
        const jalaaliDate = jalaali.toJalaali(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          1
        );
        const daysOfWeek =
          currentLanguage === "fa"
            ? ["ش", "ی", "د", "س", "چ", "پ", "ج"]
            : ["S", "M", "T", "W", "T", "F", "S"];
        const jalaaliMonthDays = jalaali.jalaaliMonthLength(
          jalaaliDate.jy,
          jalaaliDate.jm
        );
  
        if (currentLanguage === "fa") {
          calendarTitle.textContent = `${jalaaliDate.jy} ${
            jalaaliMonths[jalaaliDate.jm - 1]
          }`;
        } else {
          calendarTitle.textContent = `${currentDate.getFullYear()} ${
            gregorianMonths[currentDate.getMonth()]
          }`;
        }
  
        const today = new Date();
        const todayJalaali = jalaali.toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());
  
        calendar.querySelector(".calendar-body").innerHTML = `
          ${daysOfWeek.map((day) => `<div>${day}</div>`).join("")}
          ${Array.from(
            { length: jalaaliMonthDays },
            (_, i) => {
              const dayNumber = i + 1;
              const isToday = (jalaaliDate.jy === todayJalaali.jy &&
                               jalaaliDate.jm === todayJalaali.jm &&
                               dayNumber === todayJalaali.jd);
              return `<div class="day${isToday ? ' current-day' : ''}">${dayNumber}</div>`;
            }
          ).join("")}
        `;
  
        document.querySelectorAll(".day").forEach((dayElement) => {
          dayElement.addEventListener("click", function () {
            if (currentLanguage === "fa") {
              datepicker.value = `${jalaaliDate.jy}/${jalaaliDate.jm}/${dayElement.textContent}`;
            } else {
              datepicker.value = `${currentDate.getFullYear()}/${
                currentDate.getMonth() + 1
              }/${dayElement.textContent}`;
            }
            calendarContainer.style.display = "none";
          });
        });
  
        if (monthSelect.value === "next") {
          const nextDate = new Date(currentDate);
          nextDate.setMonth(currentDate.getMonth() + 1);
          const nextJalaaliDate = jalaali.toJalaali(
            nextDate.getFullYear(),
            nextDate.getMonth() + 1,
            1
          );
          const nextJalaaliMonthDays = jalaali.jalaaliMonthLength(
            nextJalaaliDate.jy,
            nextJalaaliDate.jm
          );
  
          if (currentLanguage === "fa") {
            nextCalendarTitle.textContent = `${nextJalaaliDate.jy} ${
              jalaaliMonths[nextJalaaliDate.jm - 1]
            }`;
          } else {
            nextCalendarTitle.textContent = `${nextDate.getFullYear()} ${
              gregorianMonths[nextDate.getMonth()]
            }`;
          }
  
          nextCalendar.querySelector(".calendar-body").innerHTML = `
            ${daysOfWeek.map((day) => `<div>${day}</div>`).join("")}
            ${Array.from(
              { length: nextJalaaliMonthDays },
              (_, i) => `<div class="day">${i + 1}</div>`
            ).join("")}
          `;
  
          nextCalendar.style.display = "block";
        } else {
          nextCalendar.style.display = "none";
        }
      } else {
        console.error("jalaali library is not defined.");
      }
  
      prevMonthButton.textContent = text[currentLanguage].prevMonth;
      nextMonthButton.textContent = text[currentLanguage].nextMonth;
      changeCalenderDate.textContent = text[currentLanguage].changeMonth;
      monthSelect.querySelector('option[value="current"]').textContent =
        text[currentLanguage].showCurrentMonth;
      monthSelect.querySelector('option[value="next"]').textContent =
        text[currentLanguage].showCurrentAndNextMonth;
    }
  
    datepicker.addEventListener("click", function () {
      calendarContainer.style.display = "block";
      updateCalendar();
    });
  
    document.addEventListener("click", function (event) {
      if (
        !calendarContainer.contains(event.target) &&
        event.target !== datepicker
      ) {
        calendarContainer.style.display = "none";
      }
    });
  
    prevMonthButton.addEventListener("click", function () {
      currentDate.setMonth(currentDate.getMonth() - 1);
      updateCalendar();
    });
  
    nextMonthButton.addEventListener("click", function () {
      currentDate.setMonth(currentDate.getMonth() + 1);
      updateCalendar();
    });
  
    monthSelect.addEventListener("change", function () {
      updateCalendar();
    });
  
    changeCalenderDate.addEventListener("click", function () {
      currentLanguage = currentLanguage === "fa" ? "en" : "fa";
      updateCalendar();
    });
  
    updateCalendar();
  });
  