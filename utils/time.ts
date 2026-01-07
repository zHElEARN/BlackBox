export const getDuration = (startTime: number | null, endTime: number) => {
  if (!startTime) return "00:00:00";
  const diff = Math.max(0, endTime - startTime);

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  const fmt = (n: number) => n.toString().padStart(2, "0");
  return `${fmt(hours)}:${fmt(minutes)}:${fmt(seconds)}`;
};
