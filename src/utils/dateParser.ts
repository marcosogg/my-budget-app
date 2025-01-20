import { parse, isValid } from 'date-fns';

export const parseCustomDate = (dateString: string): Date | null => {
  const formats = ['yyyy-MM-dd HH:mm:ss', 'yyyy-MM-dd'];
  for (const format of formats) {
    const parsedDate = parse(dateString, format, new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }
  return null;
};
