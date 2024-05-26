function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function getItem<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

function removeItem(key: string) {
  localStorage.removeItem(key);
}

const storage = {
  setItem,
  getItem,
  removeItem,
};

export default storage;
