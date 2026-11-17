import { writeFileSync } from "node:fs";

// Record received CLI args so internal-test.yml can assert how the build action passes `args`
writeFileSync("build-args.json", JSON.stringify(process.argv.slice(2)));
console.log("Build completed successfully.");
