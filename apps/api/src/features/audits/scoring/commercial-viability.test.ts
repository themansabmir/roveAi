import { describe, expect, it } from "vitest";
import { calculateCommercialViability } from "./commercial-viability";

describe("Commercial Viability Scoring Engine", () => {
  it("calculates maximum score (100) when both volume and rating are high", () => {
    const result = calculateCommercialViability({
      reviewCount: 120,
      rating: 4.8,
    });

    expect(result.score).toBe(100);
    expect(result.availability).toBe("COMPLETE");
    expect(result.coverage).toBe(1.0);
    expect(result.volumeSignal).toBe(50);
    expect(result.sentimentSignal).toBe(50);
    expect(result.factors.some((f) => f.code === "HIGH_REVIEW_VOLUME")).toBe(true);
    expect(result.factors.some((f) => f.code === "EXCELLENT_RATING")).toBe(true);
  });

  it("calculates established volume and strong rating score accurately", () => {
    const result = calculateCommercialViability({
      reviewCount: 65,
      rating: 4.2,
    });

    // Volume: 40 + Sentiment: 40 = 80
    expect(result.score).toBe(80);
    expect(result.availability).toBe("COMPLETE");
    expect(result.coverage).toBe(1.0);
    expect(result.volumeSignal).toBe(40);
    expect(result.sentimentSignal).toBe(40);
  });

  it("handles confirmed zero reviews (VERIFIED_ABSENT) independently from rating", () => {
    const result = calculateCommercialViability({
      reviewCount: 0,
      rating: 4.8,
    });

    // Volume: 5 (confirmed 0 reviews) + Sentiment: 50 = 55
    expect(result.score).toBe(55);
    expect(result.availability).toBe("COMPLETE");
    expect(result.coverage).toBe(1.0);
    expect(result.volumeSignal).toBe(5);
    expect(result.sentimentSignal).toBe(50);
    expect(result.factors.some((f) => f.code === "ZERO_REVIEWS_VERIFIED")).toBe(true);
  });

  it("calculates partial score when rating is missing/unknown but reviewCount is known", () => {
    const result = calculateCommercialViability({
      reviewCount: 50,
      rating: null,
    });

    // Volume: 40/50 -> 80
    expect(result.score).toBe(80);
    expect(result.availability).toBe("PARTIAL");
    expect(result.coverage).toBe(0.5);
    expect(result.volumeSignal).toBe(40);
    expect(result.sentimentSignal).toBeNull();
    expect(result.missingProbes).toContain("probe_rating");
  });

  it("calculates partial score when reviewCount is missing/unknown but rating is known", () => {
    const result = calculateCommercialViability({
      reviewCount: null,
      rating: 4.6,
    });

    // Sentiment: 50/50 -> 100
    expect(result.score).toBe(100);
    expect(result.availability).toBe("PARTIAL");
    expect(result.coverage).toBe(0.5);
    expect(result.volumeSignal).toBeNull();
    expect(result.sentimentSignal).toBe(50);
    expect(result.missingProbes).toContain("probe_review_count");
  });

  it("returns UNAVAILABLE and null score when neither reviewCount nor rating is known", () => {
    const result = calculateCommercialViability({
      reviewCount: null,
      rating: null,
    });

    expect(result.score).toBeNull();
    expect(result.availability).toBe("UNAVAILABLE");
    expect(result.coverage).toBe(0.0);
    expect(result.volumeSignal).toBeNull();
    expect(result.sentimentSignal).toBeNull();
    expect(result.missingProbes).toContain("probe_review_count");
    expect(result.missingProbes).toContain("probe_rating");
  });

  it("handles low ratings with vulnerable sentiment signal", () => {
    const result = calculateCommercialViability({
      reviewCount: 25,
      rating: 2.8,
    });

    // Volume (rc 25) = 30 + Sentiment (rt 2.8) = 15 => 45
    expect(result.volumeSignal).toBe(30);
    expect(result.sentimentSignal).toBe(15);
    expect(result.score).toBe(45);
    expect(result.factors.some((f) => f.code === "CRITICAL_RATING")).toBe(true);
  });
});

