export const parseCustomDate = (dateStr: string): string | null => {
  if (!dateStr) return null;
  
  try {
    console.log('Parsing date:', dateStr);
    // Split date and time
    const [datePart, timePart] = dateStr.split(' ');
    if (!datePart || !timePart) {
      console.error('Invalid date format - missing date or time part:', dateStr);
      return null;
    }

    // Parse YYYY-MM-DD format
    const [year, month, day] = datePart.split('-');
    const [hours, minutes, seconds] = timePart.split(':');

    if (!year || !month || !day || !hours || !minutes || !seconds) {
      console.error('Invalid date components:', { year, month, day, hours, minutes, seconds });
      return null;
    }

    // Validate numeric values
    const numYear = parseInt(year);
    const numMonth = parseInt(month);
    const numDay = parseInt(day);
    const numHours = parseInt(hours);
    const numMinutes = parseInt(minutes);
    const numSeconds = parseInt(seconds);

    // Basic validation
    if (
      numMonth < 1 || numMonth > 12 ||
      numDay < 1 || numDay > 31 ||
      numHours < 0 || numHours > 23 ||
      numMinutes < 0 || numMinutes > 59 ||
      numSeconds < 0 || numSeconds > 59
    ) {
      console.error('Date components out of valid range:', {
        year: numYear,
        month: numMonth,
        day: numDay,
        hours: numHours,
        minutes: numMinutes,
        seconds: numSeconds
      });
      return null;
    }

    // Additional validation for days in month
    const daysInMonth = new Date(numYear, numMonth, 0).getDate();
    if (numDay > daysInMonth) {
      console.error(`Invalid day ${numDay} for month ${numMonth}`);
      return null;
    }

    // Create date object with all components
    const date = new Date(
      numYear,
      numMonth - 1, // months are 0-based
      numDay,
      numHours,
      numMinutes,
      numSeconds
    );

    // Validate the resulting date
    if (isNaN(date.getTime())) {
      console.error('Invalid date object created:', date);
      return null;
    }

    return date.toISOString();
  } catch (error) {
    console.error('Error parsing date:', dateStr, error);
    return null;
  }
};