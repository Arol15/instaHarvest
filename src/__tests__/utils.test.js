import { datetimeToLocal } from "../utils/datetime";

it("datetime", () => {
  expect(datetimeToLocal("2021-04-25T16:25:14.821163")).toEqual(
    "2021-04-25 11:25"
  );
  expect(datetimeToLocal("2021-04-25T16:25:14.821163", "month-year")).toEqual(
    "Apr 2021"
  );
});
