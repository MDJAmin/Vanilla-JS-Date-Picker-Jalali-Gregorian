document.addEventListener("DOMContentLoaded", function () {
    const datepicker = document.getElementById("datepicker");
    const calendarContainer = document.getElementById("calendar-container");
    const calendar = document.getElementById("calendar");
    const calendarTitle = document.getElementById("calendar-title");
    const prevMonthButton = document.getElementById("prev-month");
    const nextMonthButton = document.getElementById("next-month");

    const jalaaliMonths = [
        "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
        "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
    ];

    let currentDate = new Date();

    function updateCalendar() {
        if (typeof jalaali !== 'undefined') {
            const jalaaliDate = jalaali.toJalaali(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
            const daysOfWeek = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
            const jalaaliMonthDays = jalaali.jalaaliMonthLength(jalaaliDate.jy, jalaaliDate.jm);

            calendarTitle.textContent = `${jalaaliDate.jy} ${jalaaliMonths[jalaaliDate.jm - 1]}`;

            calendar.querySelector('.calendar-body').innerHTML = `
                ${daysOfWeek.map(day => `<div>${day}</div>`).join('')}
                ${Array.from({ length: jalaaliMonthDays }, (_, i) => `<div class="day">${i + 1}</div>`).join('')}
            `;

            document.querySelectorAll(".day").forEach(dayElement => {
                dayElement.addEventListener("click", function () {
                    datepicker.value = `${jalaaliDate.jy}/${jalaaliDate.jm}/${dayElement.textContent}`;
                    calendarContainer.style.display = "none";
                });
            });
        } else {
            console.error("jalaali library is not defined.");
        }
    }

    datepicker.addEventListener("click", function () {
        calendarContainer.style.display = "block";
        updateCalendar();
    });

    document.addEventListener("click", function (event) {
        if (!calendarContainer.contains(event.target) && event.target !== datepicker) {
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
});
