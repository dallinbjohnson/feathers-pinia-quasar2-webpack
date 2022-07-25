function dateFormat(MM){
  if(!MM) return '';
  let date = new Date(MM);
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let day = date.getDay();
  let month = date.getMonth();
  let DATE = date.getDate();
  return `${days[day]}, ${months[month]} ${DATE}`;
};

export default dateFormat;
