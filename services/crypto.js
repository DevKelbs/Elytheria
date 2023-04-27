const CryptoJS = require("crypto-js");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

function encryptData(data) {
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();
  return ciphertext;
}

function decryptData(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
}

function saveActiveCharacter(character) {
  const encryptedCharacter = encryptData(character);
  localStorage.setItem("activeCharacter", encryptedCharacter);
}

function loadActiveCharacter() {
  const encryptedCharacter = localStorage.getItem("activeCharacter");
  if (!encryptedCharacter) return null;

  const character = decryptData(encryptedCharacter);
  return character;
}

module.exports = {
  saveActiveCharacter,
  loadActiveCharacter
}