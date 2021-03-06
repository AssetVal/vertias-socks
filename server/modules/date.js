const myGetDate = (date) => {
  let today;
  if (!date) {
    today = new Date();
  } else {
    today = new Date(date);
  }
  let dd = today.getDate(), mm = today.getMonth() + 1; // January is 0!,
  const yyyy = today.getFullYear();
  if (dd < 10) { dd = `0${dd}`; }
  if (mm < 10) { mm = `0${mm}`; }
  return `${mm}/${dd}/${yyyy}_${today.getUTCHours()}`;
};
module.exports = {myGetDate};
