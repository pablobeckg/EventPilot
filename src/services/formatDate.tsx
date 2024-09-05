// dateService.ts
export const formatDate = (dateString: string): { day: string; month: string } => {
    const date = new Date(dateString);
    const optionsDay: Intl.DateTimeFormatOptions = { day: 'numeric' };
    const optionsMonth: Intl.DateTimeFormatOptions = { month: 'long' };
    return {
        day: date.toLocaleDateString('en-GB', optionsDay),
        month: date.toLocaleDateString('en-GB', optionsMonth),
    };
};
