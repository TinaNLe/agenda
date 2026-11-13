class event 
{
    constructor(title, time, date, description) 
    {
        this.title = title;
        this.time = time;
        this.date = date;
        this.description = description;
    }

    destroy() 
    {
        this.title = null;
        this.time = null;
        this.date = null;
        this.description = null;
    }
}

function parseLocalDate(value) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
}

const today = new Date();
const startOfWeek = new Date(today);
startOfWeek.setDate(today.getDate() - today.getDay());

const endOfWeek = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 6);

const weekdayButtons = {};
document.querySelectorAll(".day[data-weekday]").forEach(function (dayEl) {
    weekdayButtons[dayEl.dataset.weekday] = dayEl.querySelector("button");
});
const nextWeekButton = document.querySelector(".day.next-week button");

document.querySelectorAll(".day[data-weekday]").forEach(function (dayEl) {
    const cellDate = new Date(startOfWeek);
    cellDate.setDate(startOfWeek.getDate() + Number(dayEl.dataset.weekday));

    const dateLabel = document.createElement("span");
    dateLabel.className = "date-num";
    dateLabel.textContent = cellDate.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    dayEl.querySelector("h2").appendChild(dateLabel);

    if (cellDate.toDateString() === today.toDateString()) {
        dayEl.classList.add("today");
    }
});

const monthTitle = document.querySelector(".month-title");
const monthGrid = document.querySelector(".month-grid");

monthTitle.textContent = today.toLocaleDateString(undefined, { month: "long", year: "numeric" });

const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
const firstWeekdayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

for (let i = 0; i < firstWeekdayOfMonth; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "month-cell empty";
    monthGrid.appendChild(emptyCell);
}

for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.className = "month-cell";
    cell.textContent = day;

    if (day === today.getDate()) {
        cell.classList.add("today");
    }

    monthGrid.appendChild(cell);
}

const dialog = document.getElementById("event-dialog");
const eventForm = dialog.querySelector("form");
const titleInput = document.getElementById("event-title");
const dateInput = document.getElementById("event-date");

let activeButton = null;

document.querySelectorAll(".day").forEach(function (dayEl) {
    const button = dayEl.querySelector("button");

    button.addEventListener("click", function () {
        activeButton = button;
        titleInput.value = "";
        dateInput.value = "";
        dialog.showModal();
    });
});

eventForm.addEventListener("submit", function (e) {
    if (!e.submitter || e.submitter.value !== "add" || !activeButton) return;

    const newEvent = new event(titleInput.value, null, dateInput.value, null);

    const item = document.createElement("li");

    const label = document.createElement("span");
    label.textContent = `${newEvent.title} — ${newEvent.date}`;
    item.appendChild(label);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "×";
    deleteButton.className = "delete-event";
    deleteButton.addEventListener("click", function () {
        newEvent.destroy();
        item.remove();
    });
    item.appendChild(deleteButton);

    const enteredDate = parseLocalDate(dateInput.value);
    const targetButton = enteredDate > endOfWeek
        ? nextWeekButton
        : (weekdayButtons[enteredDate.getDay()] || activeButton);

    targetButton.insertAdjacentElement("beforebegin", item);

    // --- Add asterisk to calendar cell ---
const eventDate = parseLocalDate(dateInput.value);
const eventDay = eventDate.getDate();

// Find the matching calendar cell
const calendarCells = document.querySelectorAll(".month-cell:not(.empty)");
const targetCell = Array.from(calendarCells).find(c => Number(c.textContent) === eventDay);

if (targetCell) {
    // Avoid duplicate asterisks
    if (!targetCell.querySelector(".event-indicator")) {
        const indicator = document.createElement("span");
        indicator.className = "event-indicator";
        indicator.textContent = "*";
        targetCell.appendChild(indicator);
    }
}
});
