/** @typedef  {import("prettier").Config} PrettierConfig */
/** @typedef  {import("@trivago/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig } */
const config = {
	printWidth: 80,
	tabWidth: 2,
	semi: true,
	singleQuote: false,
	quoteProps: "as-needed",
	jsxSingleQuote: false,
	trailingComma: "all",
	bracketSpacing: true,
	bracketSameLine: false,
	arrowParens: "always",
	useTabs: true,
	importOrder: [
		"/^(?!.*\\.css).*/",
		"^react$",
		"^react-(.*)$",
		"^react-dom$",
		"^@react-(.*)$",
		"^@supabase/supabase-js$",
		"<THIRD_PARTY_MODULES>",
		"^@/(.*)$", // app-specific imports
		"^[./]", // relative imports
	],
	tailwindFunctions: ["tw", "clsx", "cn"],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
	plugins: [
		"@trivago/prettier-plugin-sort-imports",
		"prettier-plugin-tailwindcss",
	],
};

export default config;
