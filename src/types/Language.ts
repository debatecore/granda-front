const availableLanguages = ["en", "pl"] as const;
export { availableLanguages };

/** languages disallowed to be selected from public lang selection menu */
const langsPublicBlacklist = ["de"];
export { langsPublicBlacklist };

type LanguageCode = (typeof availableLanguages)[number];
export type { LanguageCode };
