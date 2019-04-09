const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
// 补零
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//包含字符串
const containsString = (long, short) => { return long.indexOf(short) !== -1; }

module.exports = {
    formatTime: formatTime,
    formatNumber: formatNumber,
    containsString: containsString
}
