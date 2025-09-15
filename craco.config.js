import CracoAlias from "craco-alias";

export default {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        baseUrl: "./",
        tsConfigPath: "./tsconfig.json",
      },
    },
  ],
  devServer: {
    allowedHosts: "all" // ✅ allow all subdomains like *.skaya.org
  },
};
