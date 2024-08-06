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
    const englishMonths = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const englishDaysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    let currentDate = new Date();
  
    function getConvertedDate() {
      const isJalaali = calendarContainer.dataset.type === "jalaali";
      const date = new Date(currentDate);
    
      if (isJalaali) {
        // Convert from Jalaali to Gregorian
        const jalaaliDate = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, 1);
        return jalaali.toGregorian(jalaaliDate.jy, jalaaliDate.jm, 1);
      } else {
        // Convert from Gregorian to Jalaali
        return jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, 1);
      }
    }
    
    function updateCalendar() {
      if (typeof jalaali !== "undefined") {
        const selectedMonth = monthSelect.value;
        let displayDate = new Date(currentDate);
        let nextMonthDate = new Date(currentDate);
    
        if (selectedMonth === "next") {
          nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        }
    
        const isJalaali = calendarContainer.dataset.type === "jalaali";
    
        // Convert dates based on calendar type
        const currentJalaaliDate = isJalaali ? jalaali.toJalaali(displayDate.getFullYear(), displayDate.getMonth() + 1, 1) : getConvertedDate();
        const nextJalaaliDate = isJalaali ? jalaali.toJalaali(nextMonthDate.getFullYear(), nextMonthDate.getMonth() + 1, 1) : getConvertedDate();
    
        const months = isJalaali ? jalaaliMonths : englishMonths;
        const daysOfWeek = isJalaali ? ["ش", "ی", "د", "س", "چ", "پ", "ج"] : englishDaysOfWeek;
        const monthDays = isJalaali ? jalaali.jalaaliMonthLength(currentJalaaliDate.jy, currentJalaaliDate.jm) : new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0).getDate();
        const nextMonthDays = isJalaali ? jalaali.jalaaliMonthLength(nextJalaaliDate.jy, nextJalaaliDate.jm) : new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth() + 1, 0).getDate();
    
        calendarTitle.textContent = `${currentJalaaliDate.jy} ${months[currentJalaaliDate.jm - 1]}`;
        nextCalendarTitle.textContent = selectedMonth === "next" ? `${nextJalaaliDate.jy} ${months[nextJalaaliDate.jm - 1]}` : "";
    
        let calendarBodyHTML = `
          ${daysOfWeek.map(day => `<div>${day}</div>`).join("")}
          ${Array.from({ length: monthDays }, (_, i) => `<div class="day">${i + 1}</div>`).join("")}
        `;
    
        if (selectedMonth === "next") {
          nextCalendar.style.display = "block";
          let nextCalendarBodyHTML = `
            ${daysOfWeek.map(day => `<div>${day}</div>`).join("")}
            ${Array.from({ length: nextMonthDays }, (_, i) => `<div class="day next-month">${i + 1}</div>`).join("")}
          `;
          nextCalendar.querySelector(".calendar-body").innerHTML = nextCalendarBodyHTML;
        } else {
          nextCalendar.style.display = "none";
        }
    
        calendar.querySelector(".calendar-body").innerHTML = calendarBodyHTML;
    
        document.querySelectorAll(".day").forEach(dayElement => {
          dayElement.addEventListener("click", function () {
            const selectedMonth = dayElement.classList.contains("next-month") ? nextJalaaliDate.jm : currentJalaaliDate.jm;
            const selectedYear = dayElement.classList.contains("next-month") ? nextJalaaliDate.jy : currentJalaaliDate.jy;
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
  
    document.getElementById("toggle-calendar").addEventListener("click", function () {
      const isJalaali = calendarContainer.dataset.type === "jalaali";
      calendarContainer.dataset.type = isJalaali ? "gregorian" : "jalaali";
      updateCalendar();
    });
  
    // Initialize calendar with default type
    updateCalendar();
  });
  