import "i18next";
import settings_en from "./en/settings.json";
import sidebar_en from "./en/sidebar.json";
import dash_header_en from "./en/dash_header.json";
import login_en from "./en/login.json";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      settings: typeof settings_en;
      sidebar: typeof sidebar_en;
      dash_header: typeof dash_header_en;
      login: typeof login_en;
    };
  }
}
