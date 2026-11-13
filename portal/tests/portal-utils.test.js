import test from "node:test";
import assert from "node:assert/strict";
import { isFutureAppointmentRange } from "../src/lib/portal-utils.js";

const now = new Date("2030-01-01T10:00:00.000Z").getTime();

test("accepts a future appointment with a later end time", () => {
  assert.equal(
    isFutureAppointmentRange("2030-01-01T11:00:00.000Z", "2030-01-01T11:45:00.000Z", now),
    true
  );
});

test("rejects an appointment that starts in the past", () => {
  assert.equal(
    isFutureAppointmentRange("2030-01-01T09:59:00.000Z", "2030-01-01T10:30:00.000Z", now),
    false
  );
});

test("rejects an end time that is not after the start time", () => {
  assert.equal(
    isFutureAppointmentRange("2030-01-01T11:00:00.000Z", "2030-01-01T11:00:00.000Z", now),
    false
  );
});

test("rejects invalid or missing datetime values", () => {
  assert.equal(isFutureAppointmentRange("", "not-a-date", now), false);
});
