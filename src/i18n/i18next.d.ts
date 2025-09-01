import "i18next";
import settings_en from "./en/settings.json";
import sidebar_en from "./en/sidebar.json";

/**
 * This module provides autocomplete of i18n keys
 */
declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      settings: typeof settings_en;
      sidebar: typeof sidebar_en;
    };
  }
}
