

export function getDayOfTheWeekFromDate(date: Date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[date.getDay()]
}

export function getMonthFromDate(date: Date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return months[date.getMonth()]
}

export function getNormalizedDayOfMonth(date: Date) {
    const day = date.getDate();

    switch (day) {
        case 1:
        case 21:
        case 31:
            return `${day}st`
        case 2:
        case 22:
            return `${day}nd`
        case 3:
        case 23:
            return `${day}rd`
        default:
            return `${day}th`
    }

}