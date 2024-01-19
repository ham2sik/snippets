/**
 * 문자열(text)에서 특정문자(regExpText) 하이라이트 처리
 * @function
 * @param {string} text - 문자열
 * @param {string} regExpText - 하이라이트 처리할 문자
 * @returns {Array}
 */
const highlightTag = (text, regExpText) => {
  const regex = new RegExp(`(${regExpText.trim()})`, "i");
  const textArr = text.split(regex);
  return textArr.map((str) => {
    if (regex.test(str)) {
      // eslint-disable-next-line react/jsx-key
      return <strong>{str}</strong>;
    } else {
      return str;
    }
  });
};
