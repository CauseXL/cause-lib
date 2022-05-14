import { defineConfig, Format } from "tsup";

export default defineConfig({
  entry: ["src/command/*.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ["cjs", "esm"]
});
