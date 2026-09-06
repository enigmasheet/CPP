import fs from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const MODELS_DIR = path.join(SRC, "models");
const API_DIR = path.join(SRC, "app", "api");

function readMarkdownFiles(): string[] {
  const files = fs.readdirSync(ROOT).filter((f) => f.endsWith(".md"));
  return files.map((f) => fs.readFileSync(path.join(ROOT, f), "utf-8"));
}

function checkModels(): string[] {
  const errors: string[] = [];
  const allDocs = readMarkdownFiles().join("\n");

  if (!fs.existsSync(MODELS_DIR)) {
    errors.push("src/models/ directory does not exist");
    return errors;
  }

  const modelFiles = fs.readdirSync(MODELS_DIR).filter((f) => f.endsWith(".ts"));

  for (const file of modelFiles) {
    const modelName = file.replace(".ts", "");
    const docPattern = new RegExp(`###\\s+${modelName}\\b`);
    if (!docPattern.test(allDocs)) {
      errors.push(
        `Model "${modelName}" (src/models/${file}) is not documented in any .md file`
      );
    }
  }

  return errors;
}

function checkRoutes(): string[] {
  const errors: string[] = [];
  const allDocs = readMarkdownFiles();

  function walkDir(dir: string): string[] {
    const results: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...walkDir(fullPath));
      } else if (entry.name === "route.ts") {
        results.push(fullPath);
      }
    }
    return results;
  }

  if (!fs.existsSync(API_DIR)) {
    errors.push("src/app/api/ directory does not exist");
    return errors;
  }

  const routeFiles = walkDir(API_DIR);

  for (const file of routeFiles) {
    const relativePath = path.relative(API_DIR, file);
    const segments = relativePath.split(path.sep);
    const routeSegments: string[] = [];
    for (const seg of segments) {
      if (seg === "route.ts") continue;
      if (seg.startsWith("[")) {
        const paramName = seg.replace("[", "").replace("]", "");
        routeSegments.push("[" + paramName + "]");
      } else {
        routeSegments.push(seg);
      }
    }
    const routePath = "/api/" + routeSegments.join("/");
    const fileContent = fs.readFileSync(file, "utf-8");

    const methods = [
      "GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS", "HEAD",
    ].filter(
      (m) =>
        new RegExp(
          "export\\s+(?:const\\s+" + m + "\\s*=|async\\s+function\\s+" + m + "\\b)"
        ).test(fileContent)
    );

    for (const method of methods) {
      const found = allDocs.some((doc) => {
        const lines = doc.split("\n");
        return lines.some((line) => {
          return line.includes(method) && line.includes(routePath);
        });
      });
      if (!found) {
        errors.push(
          "Route " + method + " " + routePath + " (from " + path.relative(ROOT, file) + ") is not documented in any .md file"
        );
      }
    }
  }

  return errors;
}

function checkScripts(): string[] {
  const errors: string[] = [];
  const allDocs = readMarkdownFiles().join("\n");

  const pkgPath = path.join(ROOT, "package.json");
  if (!fs.existsSync(pkgPath)) {
    errors.push("package.json does not exist");
    return errors;
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const scripts: Record<string, string> = pkg.scripts || {};

  for (const [name] of Object.entries(scripts)) {
    if (!allDocs.includes(name)) {
      errors.push(
        'Script "' + name + '" (package.json) is not mentioned in any .md file'
      );
    }
  }

  return errors;
}

function checkConstants(): string[] {
  const errors: string[] = [];
  const allDocs = readMarkdownFiles().join("\n");

  const constantsPath = path.join(SRC, "lib", "constants.ts");
  if (!fs.existsSync(constantsPath)) {
    errors.push("src/lib/constants.ts does not exist");
    return errors;
  }

  const constantsContent = fs.readFileSync(constantsPath, "utf-8");
  const apiPathsMatch = constantsContent.match(
    /export\s+const\s+API_PATHS\s*=\s*\{([^}]+)\}/s
  );

  if (apiPathsMatch) {
    const pathLines = apiPathsMatch[1].split("\n");
    for (const line of pathLines) {
      const valueMatch = line.match(/["']([^"']+)["']/);
      if (valueMatch) {
        const apiPath = valueMatch[1];
        if (!allDocs.includes(apiPath)) {
          errors.push(
            'API path "' + apiPath + '" (constants.ts API_PATHS) is not mentioned in any .md file'
          );
        }
      }
    }
  }

  return errors;
}

function main() {
  console.log("=== Documentation Consistency Check ===\n");

  let failed = false;

  const checks = [
    { name: "Models in .md files", fn: checkModels },
    { name: "Routes in .md files", fn: checkRoutes },
    { name: "Scripts in .md files", fn: checkScripts },
    { name: "API paths in .md files", fn: checkConstants },
  ];

  for (const check of checks) {
    console.log("--- " + check.name + " ---");
    const errors = check.fn();
    if (errors.length === 0) {
      console.log("  PASS\n");
    } else {
      failed = true;
      for (const e of errors) {
        console.error("  FAIL: " + e);
      }
      console.log();
    }
  }

  if (failed) {
    console.error("Documentation check failed. Fix the issues above.");
    process.exit(1);
  } else {
    console.log("Documentation check passed! All docs are consistent.");
    process.exit(0);
  }
}

main();
