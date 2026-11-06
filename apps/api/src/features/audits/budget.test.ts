import { exceedsCeiling } from "./budget";

describe("audit budget", () => {
  it("refuses the next unit before it would pass the ceiling", () => {
    expect(exceedsCeiling(1993, 8, 2000)).toBe(true);
    expect(exceedsCeiling(1992, 8, 2000)).toBe(false);
    expect(exceedsCeiling(300, 1, 300)).toBe(true);
  });
});