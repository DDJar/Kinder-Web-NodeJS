import { format, differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatCreatedAt = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = differenceInDays(now, date);

    if (diffInDays > 1) {
        return format(date, 'dd MMM, yyyy', { locale: vi });
    } else if (diffInDays === 1) {
        return '1 ngày trước';
    } else {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        if (diffInMinutes < 1) {
            return 'mới';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} phút trước`;
        } else {
            const diffInHours = Math.floor(diffInMinutes / 60);
            return `${diffInHours} giờ trước`;
        }
    }
};
export const formatDateForDateTimeLocal = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const getVietnamTime = (daysToAdd = 0) => {
    const date = new Date();
    const vietnamTimeOffset = 14 * 60; // Offset in minutes for Vietnam time (GMT+7)
    const localTimeOffset = date.getTimezoneOffset(); // Offset in minutes for local time
    const vietnamTime = new Date(date.getTime() + (vietnamTimeOffset + localTimeOffset) * 60 * 1000);
    vietnamTime.setDate(vietnamTime.getDate() + daysToAdd);
    return vietnamTime.toISOString().slice(0, 16);
};

export const getDateNow = () => {
    const date = new Date();
    return date;
};

export function plusDate(_input, daysToAdd) {
    var _date = new Date(_input);
    _date.setDate(_date.getDate() + daysToAdd);
    return _date.toISOString().slice(0, 16);
}

export const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên cần +1
    const year = today.getFullYear();

    return { day, month, year };
};

//return yyyy-mm
export const getCurrentMonthYear = () => {
    const today = new Date();
    const formattedMonth = today.toISOString().slice(0, 7);
    return formattedMonth;
};

//return yyyy-mm-dd
export const getCurrentDateMonthYear = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
};

export function plusMonth(_input, monthsToAdd) {
    var _date = new Date(_input);
    _date.setMonth(_date.getMonth() + monthsToAdd);
    return _date.toISOString().slice(0, 10);
}
