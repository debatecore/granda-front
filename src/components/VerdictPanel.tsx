"use client";

import React, { useEffect, useMemo, useState } from "react";
import { fetchClientSide } from "@/lib/utils";

type VerdictValue = "proposition" | "opposition";

interface VerdictRecord {
  id: string;
  user_id: string;
  verdict: VerdictValue;
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUserVerdict = useMemo(
    () => verdicts.find((verdict) => verdict.user_id === userId) ?? null,
    [verdicts, userId],
  );

  const majorityVerdict = useMemo(() => {
    const counts = verdicts.reduce(
      (acc, verdict) => {
        if (verdict.verdict === "proposition") acc.proposition += 1;
        if (verdict.verdict === "opposition") acc.opposition += 1;
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
    setLoading(true);
    setError(null);

    const permissionUrl = `/users/${userId}`;
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

        const existing = loadedVerdicts.find((v) => v.user_id === userId);
        if (existing) {
          setSelectedVote(existing.verdict);
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
      })
      .finally(() => {
        setLoading(false);
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
        const patchUrl = `/tournaments/${tournamentId}/debates/${debateId}/verdicts/${currentUserVerdict.id}`;
        const response = await fetchClientSide(patchUrl, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ verdict: selectedVote }),
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
          body: JSON.stringify({ verdict: selectedVote }),
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

  if (loading) {
    return (
      <section>
        <h2>Verdict</h2>
        <p>Loading verdict information…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h2>Verdict</h2>
        <p role="alert">{error}</p>
      </section>
    );
  }

  return (
    <div className="w-[600px] h-[347px] pb-2.5 bg-[#141414] rounded outline outline-[0.50px] outline-offset-[-0.50px] outline-white/80 inline-flex flex-col justify-end items-center overflow-hidden">
      <div className="w-[580px] h-14 py-3 inline-flex justify-between items-center overflow-hidden">
        <div className="w-[30px] h-[30px] relative overflow-hidden">
          <div className="w-[2.50px] h-[2.50px] left-[13.75px] top-[13.75px] absolute outline outline-2 outline-offset-[-1px] outline-white/25" />
          <div className="w-[2.50px] h-[2.50px] left-[22.50px] top-[13.75px] absolute outline outline-2 outline-offset-[-1px] outline-white/25" />
          <div className="w-[2.50px] h-[2.50px] left-[5px] top-[13.75px] absolute outline outline-2 outline-offset-[-1px] outline-white/25" />
        </div>
        <div className="w-[305px] text-right justify-start text-white/75 text-xl font-medium">
          Verdict panel
        </div>
      </div>
      <div className="w-[580px] h-[281px] p-5 bg-[#202020] rounded shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-[0.50px] outline-offset-[-0.50px] outline-[#565656]/80 flex flex-col justify-center items-center gap-5">
        {isJudge ? (
          <>
            <div className="w-[560px] h-[54px] bg-[#202020]/0 rounded outline outline-[0.50px] outline-offset-[-0.50px] outline-[#8a8a8a]/0 inline-flex justify-center items-center gap-5 overflow-hidden">
              <button
                type="button"
                onClick={() => setSelectedVote("proposition")}
                className={`w-[270px] h-[54px] py-5 rounded outline outline-[0.50px] outline-offset-[-0.50px] outline-[#979797]/80 flex justify-center items-center gap-2.5 transition-all ${
                  selectedVote === "proposition"
                    ? "bg-[#2c2c2c] opacity-100"
                    : "bg-[#2c2c2c] opacity-50"
                }`}
              >
                <div className="opacity-75 text-center justify-center text-white/75 text-xl font-semibold">
                  Proposition
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedVote("opposition")}
                className={`w-[270px] h-[54px] py-5 rounded outline outline-[0.50px] outline-offset-[-0.50px] outline-[#979797]/80 flex justify-center items-center gap-2.5 transition-all ${
                  selectedVote === "opposition"
                    ? "bg-[#2c2c2c] opacity-100"
                    : "bg-[#2c2c2c] opacity-50"
                }`}
              >
                <div className="opacity-75 text-center justify-center text-white/75 text-xl font-semibold">
                  Opposition
                </div>
              </button>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !selectedVote}
              className="w-[560px] h-[54px] px-[262px] py-[17px] bg-[#2c2c2c] rounded outline outline-[0.50px] outline-offset-[-0.50px] outline-[#979797]/80 inline-flex justify-center items-center gap-2.5 overflow-hidden disabled:opacity-50 cursor-pointer hover:bg-[#333333] transition-colors"
            >
              <div className="w-[69px] h-6 opacity-75 text-center justify-center text-white/75 text-xl font-semibold">
                {submitting ? "Submitting..." : currentUserVerdict ? "Update" : "Submit"}
              </div>
            </button>
            <div className="w-[559px] h-[93px] px-[5px] rounded outline outline-[0.50px] outline-offset-[-0.50px] outline-[#8a8a8a]/40 flex flex-col justify-center items-center gap-2.5 overflow-hidden">
              <div className="w-[540px] h-[92px] opacity-50 text-center justify-center">
                {currentUserVerdict ? (
                  <>
                    <span className="text-white/75 text-lg font-medium leading-[26px]">
                      Your vote:{" "}
                    </span>
                    <span className="text-white/75 text-lg font-bold leading-[26px]">
                      {currentUserVerdict.verdict === "proposition"
                        ? "Proposition"
                        : "Opposition"}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-white/75 text-lg font-medium leading-[26px]">
                      There is{" "}
                    </span>
                    <span className="text-white/75 text-lg font-bold leading-[26px]">
                      no verdict
                    </span>
                    <span className="text-white/75 text-lg font-medium leading-[26px]">
                      {" "}
                      yet.
                    </span>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="w-[559px] h-[93px] px-[5px] rounded outline outline-[0.50px] outline-offset-[-0.50px] outline-[#8a8a8a]/40 flex flex-col justify-center items-center gap-2.5 overflow-hidden">
            <div className="w-[540px] h-[92px] opacity-50 text-center justify-center">
              <span className="text-white/75 text-lg font-medium leading-[26px]">
                Current decision:{" "}
              </span>
              <span className="text-white/75 text-lg font-bold leading-[26px]">
                {majorityVerdict ? majorityVerdict : "no verdict"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerdictPanel;
