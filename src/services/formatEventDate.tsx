function formatEventDate(dateString: string) {
    const date = new Date(dateString);
  
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const dayOfWeek = date.toLocaleString("default", { weekday: "short" });
  
    const getOrdinalSuffix = (n: number) => {
      if (n > 3 && n < 21) return "th";
      switch (n % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
  
    const hour = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
  
    const formattedDate = `${dayOfWeek.toUpperCase()} ${day}${getOrdinalSuffix(day)} ${month} - ${hour}:${minutes} ${ampm}`;
    
    return formattedDate.toLocaleUpperCase();
  }

  export default formatEventDate