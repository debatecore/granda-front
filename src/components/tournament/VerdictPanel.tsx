"use client";

import React, { useEffect, useMemo, useState } from "react";
import { fetchClientSide } from "@/lib/utils";
import { GenericComponent } from "../ui/GenericComponent";

type VerdictValue = "proposition" | "opposition";

interface VerdictRecord {
  id: string;
  judge_user_id: string;
  proposition_won: boolean;
}

interface VerdictPanelProps {
  userId: string;
  tournamentId: string;
  debateId: string;
}

const VerdictPanel: React.FC<VerdictPanelProps> = ({
  userId,
  tournamentId,
  debateId,
}) => {
  const [isJudge, setIsJudge] = useState<boolean | null>(null);
  const [verdicts, setVerdicts] = useState<VerdictRecord[]>([]);
  const [selectedVote, setSelectedVote] = useState<VerdictValue | null>(null);
  // const [loading, setLoading] = useState(true); // can be used to show a loading state if needed
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUserVerdict = useMemo(
    () => verdicts.find((verdict) => verdict.judge_user_id === userId) ?? null,
    [verdicts, userId],
  );

  const majorityVerdict = useMemo(() => {
    const counts = verdicts.reduce(
      (acc, verdict) => {
        if (verdict.proposition_won) acc.proposition += 1;
        else acc.opposition += 1;
        return acc;
      },
      { proposition: 0, opposition: 0 },
    );

    if (counts.proposition === 0 && counts.opposition === 0) {
      return null;
    }

    if (counts.proposition > counts.opposition) return "Proposition";
    if (counts.opposition > counts.proposition) return "Opposition";
    return "Tie";
  }, [verdicts]);

  useEffect(() => {
    setError(null);
    console.log(userId + " " + tournamentId + " " + debateId);

    const permissionUrl =
      `/users/${userId}/tournaments/${tournamentId}/permissions` +
      `?permission_name=SubmitOwnVerdictVote`;
    const verdictsUrl = `/tournaments/${tournamentId}/debates/${debateId}/verdicts`;

    Promise.all([
      fetchClientSide(permissionUrl).then((res) => {
        if (!res.ok) throw new Error("Failed to load permissions");
        return res.json();
      }),
      fetchClientSide(verdictsUrl).then((res) => {
        if (!res.ok) throw new Error("Failed to load verdicts");
        return res.json();
      }),
    ])
      .then(([permissionData, verdictsData]) => {
        setIsJudge(Boolean(permissionData));
        const loadedVerdicts: VerdictRecord[] = Array.isArray(verdictsData)
          ? verdictsData
          : [];
        setVerdicts(loadedVerdicts);

        const existing = loadedVerdicts.find((v) => v.judge_user_id === userId);
        if (existing) {
          setSelectedVote(
            existing.proposition_won ? "proposition" : "opposition",
          );
        } else {
          setSelectedVote(null);
        }
      })
      .catch((fetchError) => {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load verdict information",
        );
      });
  }, [userId, tournamentId, debateId]);

  const handleSubmit = async () => {
    if (!selectedVote) {
      setError("Please select a verdict before submitting.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (currentUserVerdict) {
        const isSameVote =
          currentUserVerdict.proposition_won ===
          (selectedVote === "proposition");
        if (isSameVote) {
          setSubmitting(false);
          return;
        }
        const patchUrl = `/tournaments/${tournamentId}/debates/${debateId}/verdicts/${currentUserVerdict.id}`;
        const response = await fetchClientSide(patchUrl, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            debate_id: debateId,
            judge_user_id: userId,
            proposition_won: selectedVote === "proposition",
          }),
        });
        if (!response.ok) throw new Error("Failed to update verdict");
        const updatedVerdict: VerdictRecord = await response.json();
        setVerdicts((prev) =>
          prev.map((verdict) =>
            verdict.id === updatedVerdict.id ? updatedVerdict : verdict,
          ),
        );
      } else {
        const postUrl = `/tournaments/${tournamentId}/debates/${debateId}/verdicts`;
        const response = await fetchClientSide(postUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            debate_id: debateId,
            judge_user_id: userId,
            proposition_won: selectedVote === "proposition",
          }),
        });
        if (!response.ok) throw new Error("Failed to submit verdict");
        const newVerdict: VerdictRecord = await response.json();
        setVerdicts((prev) => [...prev, newVerdict]);
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit verdict",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <section>
        <h2>
          <b>Verdict panel got an error, oops:</b>
        </h2>
        <p role="alert">{error}</p>
      </section>
    );
  }

  return (
    <GenericComponent title="Verdict Panel">
      {isJudge ? (
        <div className="flex flex-col gap-4">
          <div className="w-full inline-flex justify-center items-center gap-5">
            <button
              type="button"
              onClick={() => setSelectedVote("proposition")}
              className={`flex-1 min-w-0 h-[54px] py-5 rounded outline outline-[0.50px] outline-offset-[-0.50px]
            flex justify-center items-center transition-all 
            ${
              selectedVote === "proposition"
                ? "bg-purple-500/15 outline-purple-400/60"
                : "bg-white/10 border-stone-600 hover:bg-purple-500/10 hover:outline-purple-400/40 cursor-pointer"
            }`}
            >
              <div
                className={`text-center text-xl font-semibold transition-colors
              ${
                selectedVote === "proposition" ? "text-white" : "text-white/75"
              }`}
              >
                Proposition
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedVote("opposition")}
              className={`flex-1 min-w-0 h-[54px] py-5 rounded outline outline-[0.50px] outline-offset-[-0.50px]
            flex justify-center items-center transition-all
            ${
              selectedVote === "opposition"
                ? "bg-pink-500/15 outline-pink-400/60"
                : "bg-white/10 border-stone-600 hover:bg-pink-500/10 hover:outline-pink-400/40 cursor-pointer"
            }`}
            >
              <div
                className={`text-center text-xl font-semibold transition-colors
              ${
                selectedVote === "opposition" ? "text-white" : "text-white/75"
              }`}
              >
                Opposition
              </div>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !selectedVote}
            className={`w-full h-[54px] py-[17px] rounded
          outline outline-[0.50px] outline-offset-[-0.50px]
          inline-flex justify-center items-center overflow-hidden
          transition-all duration-200
          disabled:cursor-not-allowed
          ${
            selectedVote === "proposition"
              ? "bg-purple-500/15 outline-purple-400/60 hover:bg-purple-500/25 cursor-pointer"
              : selectedVote === "opposition"
                ? "bg-pink-500/15 outline-pink-400/60 hover:bg-pink-500/25 cursor-pointer"
                : "bg-[#242424] outline-[#666666]/40 opacity-50"
          }
        `}
          >
            <div
              className={`text-center text-xl font-semibold transition-colors
            ${selectedVote ? "text-white/90" : "text-white/50"}`}
            >
              Submit
            </div>
          </button>

          <div
            className={`w-full min-h-[93px] px-[5px] rounded outline outline-[0.50px] outline-offset-[-0.50px] outline-[#8a8a8a]/40 flex flex-col justify-center items-center overflow-hidden ${
              majorityVerdict === "Proposition"
                ? "bg-gradient-to-r from-purple-500/15 via-transparent to-purple-500/15"
                : majorityVerdict === "Opposition"
                  ? "bg-gradient-to-r from-pink-400/15 via-transparent to-pink-400/15"
                  : ""
            }`}
          >
            <div className="w-full opacity-50 text-center flex justify-center items-center flex-wrap px-4 py-6">
              {majorityVerdict === "Proposition" ? (
                <>
                  <span className="text-white text-lg font-medium leading-[26px]">
                    The
                  </span>

                  <span className="text-white text-lg font-bold leading-[26px] mx-1.5">
                    Proposition
                  </span>

                  <span className="text-white text-lg font-medium leading-[26px]">
                    is the winning team!
                  </span>
                </>
              ) : majorityVerdict === "Opposition" ? (
                <>
                  <span className="text-white text-lg font-medium leading-[26px]">
                    The
                  </span>

                  <span className="text-white text-lg font-bold leading-[26px] mx-1.5">
                    Opposition
                  </span>

                  <span className="text-white text-lg font-medium leading-[26px]">
                    is the winning team!
                  </span>
                </>
              ) : (
                <>
                  <span className="text-white/75 text-lg font-medium leading-[26px]">
                    There is
                  </span>

                  <span className="text-white/75 text-lg font-bold leading-[26px] mx-1.5">
                    no verdict
                  </span>

                  <span className="text-white/75 text-lg font-medium leading-[26px]">
                    yet.
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`w-full min-h-[93px] px-[5px] rounded outline outline-[0.50px] outline-offset-[-0.50px] outline-[#8a8a8a]/40 flex justify-center items-center overflow-hidden ${
            majorityVerdict === "Proposition"
              ? "bg-gradient-to-r from-purple-500/15 via-transparent to-purple-500/15"
              : majorityVerdict === "Opposition"
                ? "bg-gradient-to-r from-pink-400/15 via-transparent to-pink-400/15"
                : ""
          }`}
        ></div>
      )}
    </GenericComponent>
  );
};

export default VerdictPanel;
