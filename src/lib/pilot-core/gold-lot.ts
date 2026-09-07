/** Gold-LOT master ID shared with the portal register: L-YYYYMMDD-<letter>-NN */

export function formatGoldLotCode(productionDate: string, letter: string, seq: number): string {
  const day = productionDate.slice(0, 10);
  const lotLetter = letter.trim().toUpperCase().match(/[A-Z]/)?.[0];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !lotLetter || seq < 1) {
    throw new Error("invalid Gold-LOT parts");
  }
  return `L-${day.replaceAll("-", "")}-${lotLetter}-${String(Math.trunc(seq)).padStart(2, "0")}`;
}
