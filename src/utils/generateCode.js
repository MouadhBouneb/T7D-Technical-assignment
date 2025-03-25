const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

module.exports = function (length = 8) {
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};
