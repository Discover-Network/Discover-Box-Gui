export const hideMiddleStr = (str, frontLen, endLen) => {
  let newStr = "";
  for (let i = 0; i < 2; i++) {
    newStr += "*";
  }
  return (
    str.substring(0, frontLen) + newStr + str.substring(str.length - endLen)
  );
};
