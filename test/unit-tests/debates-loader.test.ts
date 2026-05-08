import { loadDebates } from "@/components/tournament/debates-loader";
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

describe("loadDebates", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedCookies.mockResolvedValue({
      toString: () => "session=test-cookie",
    });
  });

  test("should call debates endpoint and return debates when backend responds with ok", async () => {
    mockedFetchServerside.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: "debate-1",
          marshal_user_id: "marshal-1",
          motion_id: "motion-1",
          round_id: "round-1",
          tournament_id: "tournament-1",
        },
      ],
    } as Response);

    const result = await loadDebates("tournament-1");

    expect(mockedFetchServerside).toHaveBeenCalledTimes(1);
    expect(mockedFetchServerside).toHaveBeenCalledWith(
      "/tournaments/tournament-1/debates",
      {
        cache: "no-store",
        headers: {
          Cookie: "session=test-cookie",
        },
      },
    );

    expect(result).toEqual({
      debates: [
        {
          id: "debate-1",
          marshal_user_id: "marshal-1",
          motion_id: "motion-1",
          round_id: "round-1",
          tournament_id: "tournament-1",
        },
      ],
      loadError: false,
    });
  });

  test("should return loadError when backend responds with non-ok status", async () => {
    mockedFetchServerside.mockResolvedValue({
      ok: false,
    } as Response);

    const result = await loadDebates("tournament-1");

    expect(result).toEqual({
      debates: [],
      loadError: true,
    });
  });
});
