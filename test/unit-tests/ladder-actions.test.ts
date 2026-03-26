import { planTournament } from "@/components/tournament/ladder-actions";
import { fetchServerside } from "@/lib/utils";
import { cookies } from "next/headers";

jest.mock("@/lib/utils", () => ({
  fetchServerside: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

const mockedFetchServerside = fetchServerside as jest.MockedFunction<
  typeof fetchServerside
>;
const mockedCookies = cookies as jest.Mock;

describe("planTournament", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedCookies.mockResolvedValue({
      toString: () => "session=test-cookie",
    } as Awaited<ReturnType<typeof cookies>>);
  });

  test("should return validation_positive_integer when one of the values is not a positive integer", async () => {
    // GIVEN
    const formData = new FormData();
    formData.set("group_phase_rounds", "0");
    formData.set("groups_count", "2");
    formData.set("advancing_teams", "4");

    // WHEN
    const result = await planTournament(
      "test-tournament-id",
      { success: false, error: null },
      formData
    );

    // THEN
    expect(result).toEqual({
      success: false,
      error: "validation_positive_integer",
    });
    expect(mockedFetchServerside).not.toHaveBeenCalled();
  });

  test("should return validation_positive_integer when one of the values is not an integer", async () => {
    // GIVEN
    const formData = new FormData();
    formData.set("group_phase_rounds", "2.5");
    formData.set("groups_count", "2");
    formData.set("advancing_teams", "4");

    // WHEN
    const result = await planTournament(
      "test-tournament-id",
      { success: false, error: null },
      formData
    );

    // THEN
    expect(result).toEqual({
      success: false,
      error: "validation_positive_integer",
    });
    expect(mockedFetchServerside).not.toHaveBeenCalled();
  });

  test("should return validation_power_of_two when advancing_teams is not a power of two", async () => {
    // GIVEN
    const formData = new FormData();
    formData.set("group_phase_rounds", "3");
    formData.set("groups_count", "2");
    formData.set("advancing_teams", "3");

    // WHEN
    const result = await planTournament(
      "test-tournament-id",
      { success: false, error: null },
      formData
    );

    // THEN
    expect(result).toEqual({
      success: false,
      error: "validation_power_of_two",
    });
    expect(mockedFetchServerside).not.toHaveBeenCalled();
  });

  test("should call the plan endpoint and return success when backend responds with ok", async () => {
    // GIVEN
    const formData = new FormData();
    formData.set("group_phase_rounds", "3");
    formData.set("groups_count", "2");
    formData.set("advancing_teams", "4");

    mockedFetchServerside.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => "",
    } as Response);

    // WHEN
    const result = await planTournament(
      "test-tournament-id",
      { success: false, error: null },
      formData
    );

    // THEN
    expect(mockedFetchServerside).toHaveBeenCalledTimes(1);
    expect(mockedFetchServerside).toHaveBeenCalledWith(
      "/tournament/test-tournament-id/plan",
      {
        method: "POST",
        headers: {
          Cookie: "session=test-cookie",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group_phase_rounds: 3,
          groups_count: 2,
          advancing_teams: 4,
        }),
      }
    );

    expect(result).toEqual({
      success: true,
      error: null,
    });
  });

  test("should return request_failed when backend responds with non-ok status", async () => {
    // GIVEN
    const formData = new FormData();
    formData.set("group_phase_rounds", "3");
    formData.set("groups_count", "2");
    formData.set("advancing_teams", "4");

    mockedFetchServerside.mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => "Not found",
    } as Response);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // WHEN
    const result = await planTournament(
      "test-tournament-id",
      { success: false, error: null },
      formData
    );

    // THEN
    expect(mockedFetchServerside).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      success: false,
      error: "request_failed",
    });

    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});