import moment from "moment-timezone";

export const datetimeToLocal = (dateStr, format) => {
  if (!dateStr || dateStr.length === 0) {
    return "";
  }
  const dateObject = new Date(`${dateStr}+00:00`);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const today = moment().tz(timeZone);
  const offset = today.utcOffset() / 60;
  const currentHours = dateObject.getHours();
  dateObject.setHours(currentHours + offset);
  const newDateString = dateObject.toISOString().replace("T", " ").slice(0, 16);
  if (format === "month-year") {
    const monthStr = dateObject.toDateString().slice(4, 7);
    const year = dateObject.toDateString().slice(11);
    return `${monthStr} ${year}`;
  }
  return `${newDateString}`;
};
