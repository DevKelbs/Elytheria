const crypto = require('crypto-browserify');
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

function encryptData(data) {
  const ciphertext = crypto.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();
  return ciphertext;
}

function decryptData(ciphertext) {
  const bytes = crypto.AES.decrypt(ciphertext, SECRET_KEY);
  const decryptedData = JSON.parse(bytes.toString(crypto.enc.Utf8));
  return decryptedData;
}

export function saveActiveCharacter(character) {
  const encryptedCharacter = encryptData(character);
  localStorage.setItem("activeCharacter", encryptedCharacter);
}

export function loadActiveCharacter() {
  const encryptedCharacter = localStorage.getItem("activeCharacter");
  if (!encryptedCharacter) return null;

  const character = decryptData(encryptedCharacter);
  return character;
}