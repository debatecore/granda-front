To keep i18n files in order, create a separate file for each user-facing view.
To do that:

1. Create `.json` files, one per language, each in their respective folders.
2. Add the files to i18n resources list found in in `src/i18n/config.ts`.
3. To use autocomplete, add the `en` file to `src/i18n/i18next-autocomplete.d.ts`.
