document.addEventListener("DOMContentLoaded", function () {
  const datepicker = document.querySelector(".datepicker");

  // Create and add calendar container
  const calendarContainer = document.createElement("div");
  calendarContainer.id = "calendar-container";
  calendarContainer.className = "calendar-container";
  document.body.appendChild(calendarContainer);

  // Calendar content
  calendarContainer.innerHTML = `
        <div id="calendars">
            <div id="calendar" class="calendar">
                <div class="calendar-header">
                    <button id="prev-month">قبلی</button>
                    <span id="calendar-title"></span>
                    <button id="next-month">بعدی</button>
                </div>
                <div class="calendar-body" id="current-calendar"></div>
            </div>
            <div id="next-calendar" class="calendar" style="display: none">
                <div class="calendar-header">
                    <span id="next-calendar-title"></span>
                </div>
                <div class="calendar-body"></div>
            </div>
        </div>
        <select id="month-select">
            <option value="current">نمایش ماه فعلی</option>
            <option value="next">نمایش ماه فعلی و ماه آینده</option>
        </select>
        <button id="change-calender-date">تغییر زبان</button>
    `;

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
      document.body.className = currentLanguage;

      const jalaaliDate = jalaali.toJalaali(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      );
      const gregorianDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
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

      const today = new Date();
      const todayJalaali = jalaali.toJalaali(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
      );
      const todayGregorian = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      if (currentLanguage === "fa") {
        calendarTitle.textContent = `${jalaaliDate.jy} ${
          jalaaliMonths[jalaaliDate.jm - 1]
        } (${todayGregorian.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })})`;
      } else {
        calendarTitle.textContent = `${currentDate.getFullYear()} ${
          gregorianMonths[currentDate.getMonth()]
        } (${todayJalaali.jy}/${todayJalaali.jm}/${todayJalaali.jd})`;
      }

      calendar.querySelector(".calendar-body").innerHTML = `
                ${daysOfWeek.map((day) => `<div>${day}</div>`).join("")}
                ${Array.from({ length: jalaaliMonthDays }, (_, i) => {
                  const dayNumber = i + 1;
                  const isToday =
                    jalaaliDate.jy === todayJalaali.jy &&
                    jalaaliDate.jm === todayJalaali.jm &&
                    dayNumber === todayJalaali.jd;
                  return `<div class="day${
                    isToday ? " current-day" : ""
                  }">${dayNumber}</div>`;
                }).join("")}
            `;

      document.querySelectorAll(".day").forEach((dayElement) => {
        dayElement.addEventListener("click", function () {
          if (currentLanguage === "fa") {
            datepicker.value = `${jalaaliDate.jy}/${jalaaliDate.jm}/${
              dayElement.textContent
            } (${gregorianDate.getFullYear()}/${gregorianDate.getMonth() + 1}/${
              dayElement.textContent
            })`;
          } else {
            datepicker.value = `${currentDate.getFullYear()}/${
              currentDate.getMonth() + 1
            }/${dayElement.textContent} (${todayJalaali.jy}/${
              todayJalaali.jm
            }/${dayElement.textContent})`;
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
          } (${new Date(
            nextDate.getFullYear(),
            nextDate.getMonth(),
            1
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })})`;
        } else {
          nextCalendarTitle.textContent = `${nextDate.getFullYear()} ${
            gregorianMonths[nextDate.getMonth()]
          } (${nextJalaaliDate.jy}/${nextJalaaliDate.jm}/${1})`;
        }

        nextCalendar.querySelector(".calendar-body").innerHTML = `
                    ${daysOfWeek.map((day) => `<div>${day}</div>`).join("")}
                    ${Array.from({ length: nextJalaaliMonthDays }, (_, i) => {
                      const dayNumber = i + 1;
                      const isToday =
                        nextJalaaliDate.jy === todayJalaali.jy &&
                        nextJalaaliDate.jm === todayJalaali.jm &&
                        dayNumber === todayJalaali.jd;
                      return `<div class="day${
                        isToday ? " current-day" : ""
                      }">${dayNumber}</div>`;
                    }).join("")}
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

  // Show/hide calendar
  datepicker.addEventListener("click", function () {
    calendarContainer.style.display =
      calendarContainer.style.display === "none" ? "block" : "none";
    updateCalendar();
  });

  document.addEventListener("click", function (event) {
    if (
      !calendarContainer.contains(event.target) &&
      !datepicker.contains(event.target)
    ) {
      calendarContainer.style.display = "none";
    }
  });

  // Navigation buttons
  prevMonthButton.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
  });

  nextMonthButton.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
  });

  monthSelect.addEventListener("change", updateCalendar);

  changeCalenderDate.addEventListener("click", function () {
    currentLanguage = currentLanguage === "fa" ? "en" : "fa";
    updateCalendar();
  });

  updateCalendar();
});
