let THROTTLE;
function throttle(executeFunction, delay, event) {
  clearTimeout(THROTTLE);
  THROTTLE = setTimeout(() => executeFunction(event), delay);
}
export default throttle;
