export function exceedsCeiling(used: number, nextUnit: number, limit: number): boolean {
  return used + nextUnit > limit;
}
