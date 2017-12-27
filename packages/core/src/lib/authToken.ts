export const generate = () => {
  return require("crypto")
    .randomBytes(20)
    .toString("base64")
    .replace(/\W/g, "");
};
