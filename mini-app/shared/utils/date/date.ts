import dayjs from 'dayjs';

export const getDateYearDiff = (startDate: Date, endDate: Date) =>
  dayjs(startDate).diff(endDate, 'year');
