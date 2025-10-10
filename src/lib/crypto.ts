import CryptoJS from "crypto-js";

const SECRET_SALT = process.env.SECRET_SALT || "default-salt-change-this";

export function generatePassword(name: string, length: number = 12): string {
  // Cria um hash a partir do nome + salt
  const hash = CryptoJS.SHA256(name + SECRET_SALT).toString();

  // Caracteres permitidos
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "@#$%&*!";

  let password = "";

  // Garante pelo menos um de cada tipo
  password += uppercase[parseInt(hash.substring(0, 2), 16) % uppercase.length];
  password += lowercase[parseInt(hash.substring(2, 4), 16) % lowercase.length];
  password += numbers[parseInt(hash.substring(4, 6), 16) % numbers.length];
  password += symbols[parseInt(hash.substring(6, 8), 16) % symbols.length];

  // Preenche o restante
  const allChars = uppercase + lowercase + numbers + symbols;
  for (let i = 4; i < length; i++) {
    const index =
      parseInt(hash.substring(i * 2, i * 2 + 2), 16) % allChars.length;
    password += allChars[index];
  }

  // Embaralha a senha
  password = password
    .split("")
    .sort(() => {
      return (parseInt(hash.substring(20, 22), 16) % 3) - 1;
    })
    .join("");

  return password.substring(0, length);
}

export function generateNumericPassword(
  name: string,
  length: number = 12
): string {
  const hash = CryptoJS.SHA256(name + SECRET_SALT).toString();
  const digits = "0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    const index =
      parseInt(hash.substring(i * 2, i * 2 + 2), 16) % digits.length;
    password += digits[index];
  }

  return password;
}

export function verifyNumericPassword(
  password: string,
  name: string,
  length: number
): boolean {
  const generated = generateNumericPassword(name, length);
  return password === generated;
}

export function verifyPassword(
  password: string,
  name: string,
  length: number
): boolean {
  const generatedPassword = generatePassword(name, length);
  return password === generatedPassword;
}
