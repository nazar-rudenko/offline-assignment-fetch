import { expect, it, describe } from "vitest";
import { getPaginationPages } from "./utils";

describe("getPaginationPages", () => {
  it("should return all pages when totalPages is less than or equal to the limit", () => {
    const params = { page: 3, totalPages: 4, limit: 5 };
    const result = getPaginationPages(params);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it("should return the correct visible pages when pagination is centered", () => {
    const params = { page: 3, totalPages: 10, limit: 5 };
    const result = getPaginationPages(params);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it("should return the correct visible pages when page is near the beginning", () => {
    const params = { page: 2, totalPages: 10, limit: 5 };
    const result = getPaginationPages(params);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it("should return the correct visible pages when page is near the end", () => {
    const params = { page: 9, totalPages: 10, limit: 5 };
    const result = getPaginationPages(params);
    expect(result).toEqual([6, 7, 8, 9, 10]);
  });

  it("should adjust the range to fit within the total pages", () => {
    const params = { page: 7, totalPages: 10, limit: 5 };
    const result = getPaginationPages(params);
    expect(result).toEqual([5, 6, 7, 8, 9]);
  });

  it("should return the last set of pages when totalPages is just over the limit", () => {
    const params = { page: 9, totalPages: 11, limit: 5 };
    const result = getPaginationPages(params);
    expect(result).toEqual([7, 8, 9, 10, 11]);
  });

  it("should handle when totalPages is 1", () => {
    const params = { page: 1, totalPages: 1, limit: 5 };
    const result = getPaginationPages(params);
    expect(result).toEqual([1]);
  });

  it("should handle when totalPages is 2 and page is 1", () => {
    const params = { page: 1, totalPages: 2, limit: 2 };
    const result = getPaginationPages(params);
    expect(result).toEqual([1, 2]);
  });

  it("should handle when totalPages is 2 and page is 2", () => {
    const params = { page: 2, totalPages: 2, limit: 2 };
    const result = getPaginationPages(params);
    expect(result).toEqual([1, 2]);
  });
});
