function getDateTime() {
  return new Date().toISOString();
}

function getMonthRange() {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
  return {
    firstDay,
    lastDay
  };
}

function getDate() {
  let now = new Date();
  let year = now.getFullYear();
  let month: any = now.getMonth() + 1;
  let day: any = now.getDate();
  if (month.toString().length == 1) {
    month = "0" + month;
  }
  if (day.toString().length == 1) {
    day = "0" + day;
  }
  let dateTime = year + "-" + month + "-" + day;
  return new Date(dateTime).toISOString();
}

function getDateRange() {
  const start = new Date();
  start.setUTCHours(0,0,0,0);
  
  const end = new Date();
  end.setUTCHours(23,59,59,999);

  return {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };
}

function convertDateToISOString(date: string) {
  let now = new Date(date);
  let year = now.getFullYear();
  let month: any = now.getMonth() + 1;
  let day: any = now.getDate();
  if (month.toString().length == 1) {
    month = "0" + month;
  }
  if (day.toString().length == 1) {
    day = "0" + day;
  }
  let dateTime = year + "-" + month + "-" + day;
  return new Date(dateTime).toISOString();
}

export { getDateTime, getDate, convertDateToISOString,getDateRange, getMonthRange };
