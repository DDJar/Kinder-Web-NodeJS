import { format, toZonedTime } from "date-fns-tz";
export const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0 nên cần +1
  const year = today.getFullYear();

  return { day, month, year };
};

export const getMonthDetails = (month, year) => {
  const daysInMonth = new Date(year, month, 0).getDate();

  let saturdays = 0;
  let sundays = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();

    if (dayOfWeek === 6) {
      // Thứ 7
      saturdays++;
    } else if (dayOfWeek === 0) {
      // Chủ nhật
      sundays++;
    }
  }

  return {
    daysInMonth,
    saturdays,
    sundays,
  };
};
export const formatDateTime = () => {
  const currentDate = new Date();
  const day = currentDate
    .getDate()
    .toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const hours = currentDate
    .getHours()
    .toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const minutes = currentDate
    .getMinutes()
    .toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const seconds = currentDate
    .getSeconds()
    .toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const date = currentDate;
  return { day, month, year, hours, minutes, seconds, date };
};
export const convertUtcToVietnamTime = (utcDate) => {
  const timeZone = "Asia/Ho_Chi_Minh";

  const vietnamTime = toZonedTime(utcDate, timeZone);

  const day = vietnamTime.getDate();
  const month = vietnamTime.getMonth() + 1;
  const year = vietnamTime.getFullYear();
  const hours = vietnamTime.getHours();
  const minutes = vietnamTime.getMinutes();
  const formattedDate = format(vietnamTime, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", {
    timeZone,
  });

  return {
    formattedDate,
    day,
    month,
    year,
    hours,
    minutes,
  };
};
export const getDateMonthYearByTimestamps = (_value) => {
  const date = new Date(_value);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return { day, month, year };
};
