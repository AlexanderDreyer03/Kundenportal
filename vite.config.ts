import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // WICHTIG: Repo-Name eintragen (genau wie das GitHub-Repo heißen wird)
  base: "/REPO_NAME/",
});
