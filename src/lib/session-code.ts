import { SESSION_CODE_CHARSET, SESSION_CODE_LENGTH } from "./constants";

export function generateSessionCode(): string {
  let code = "";
  for (let i = 0; i < SESSION_CODE_LENGTH; i++) {
    code += SESSION_CODE_CHARSET[Math.floor(Math.random() * SESSION_CODE_CHARSET.length)];
  }
  return code;
}
