import { generate } from "generate-password";

export const generateRandomPass = () => {
  return generate({
    length: 10,
    numbers: true,
  });
};
