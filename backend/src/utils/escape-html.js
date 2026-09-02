const escapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#039;"
};

export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => escapeMap[char]);
}
