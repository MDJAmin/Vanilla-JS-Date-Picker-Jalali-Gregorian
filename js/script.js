document.addEventListener("DOMContentLoaded", function () {
  const datepicker = document.getElementById("datepicker");
  const calendarContainer = document.getElementById("calendar-container");
  const calendar = document.getElementById("calendar");
  const calendarTitle = document.getElementById("calendar-title");
  const nextCalendarTitle = document.getElementById("next-calendar-title");
  const prevMonthButton = document.getElementById("prev-month");
  const nextMonthButton = document.getElementById("next-month");
  const monthSelect = document.getElementById("month-select");
  const nextCalendar = document.getElementById("next-calendar");

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

  let currentDate = new Date();

  function updateCalendar() {
    if (typeof jalaali !== "undefined") {
      const selectedMonth = monthSelect.value;
      let displayDate = new Date(currentDate);
      let nextMonthDate = new Date(currentDate);

      if (selectedMonth === "next") {
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
      }

      const jalaaliDate = jalaali.toJalaali(
        displayDate.getFullYear(),
        displayDate.getMonth() + 1,
        1
      );
      const nextJalaaliDate = jalaali.toJalaali(
        nextMonthDate.getFullYear(),
        nextMonthDate.getMonth() + 1,
        1
      );

      const daysOfWeek = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
      const jalaaliMonthDays = jalaali.jalaaliMonthLength(
        jalaaliDate.jy,
        jalaaliDate.jm
      );
      const nextJalaaliMonthDays = jalaali.jalaaliMonthLength(
        nextJalaaliDate.jy,
        nextJalaaliDate.jm
      );

      calendarTitle.textContent = `${jalaaliDate.jy} ${
        jalaaliMonths[jalaaliDate.jm - 1]
      }`;
      nextCalendarTitle.textContent =
        selectedMonth === "next"
          ? `${nextJalaaliDate.jy} ${jalaaliMonths[nextJalaaliDate.jm - 1]}`
          : "";

      let calendarBodyHTML = `
                ${daysOfWeek.map((day) => `<div>${day}</div>`).join("")}
                ${Array.from(
                  { length: jalaaliMonthDays },
                  (_, i) => `<div class="day">${i + 1}</div>`
                ).join("")}
            `;

      if (selectedMonth === "next") {
        nextCalendar.style.display = "block";
        let nextCalendarBodyHTML = `
                    ${daysOfWeek.map((day) => `<div>${day}</div>`).join("")}
                    ${Array.from(
                      { length: nextJalaaliMonthDays },
                      (_, i) => `<div class="day next-month">${i + 1}</div>`
                    ).join("")}
                `;
        nextCalendar.querySelector(".calendar-body").innerHTML =
          nextCalendarBodyHTML;
      } else {
        nextCalendar.style.display = "none";
      }

      calendar.querySelector(".calendar-body").innerHTML = calendarBodyHTML;

      document.querySelectorAll(".day").forEach((dayElement) => {
        dayElement.addEventListener("click", function () {
          const selectedMonth = dayElement.classList.contains("next-month")
            ? nextJalaaliDate.jm
            : jalaaliDate.jm;
          const selectedYear = dayElement.classList.contains("next-month")
            ? nextJalaaliDate.jy
            : jalaaliDate.jy;
          datepicker.value = `${selectedYear}/${selectedMonth}/${dayElement.textContent}`;
          calendarContainer.style.display = "none";
        });
      });
    } else {
      console.error("jalaali library is not defined.");
    }
  }

  datepicker.addEventListener("click", function () {
    calendarContainer.style.display = "flex";
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
});
