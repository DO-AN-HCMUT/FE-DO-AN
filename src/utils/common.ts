export function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const hashStringToRange = (str: string) => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = (hash + str.charCodeAt(i) * (i + 1)) % 10; // Modulo 10 for range 0-9
  }

  return hash;
};
