export const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên cần +1
    const year = today.getFullYear();

    return {day, month, year};
}

export const getMonthDetails = (month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate();

    let saturdays = 0;
    let sundays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay();

        if (dayOfWeek === 6) { // Thứ 7
            saturdays++;
        } else if (dayOfWeek === 0) { // Chủ nhật
            sundays++;
        }
    }

    return {
        daysInMonth,
        saturdays,
        sundays
    };
}