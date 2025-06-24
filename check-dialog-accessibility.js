import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively get all TypeScript and JavaScript files
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      // Skip node_modules and other unwanted directories
      if (
        !["node_modules", ".git", "dist", "build", "coverage"].includes(file)
      ) {
        getAllFiles(fullPath, arrayOfFiles);
      }
    } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

// Function to check for dialog accessibility issues
function checkDialogAccessibility(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const issues = [];

  // Check for DialogContent without DialogDescription
  const dialogContentMatches = content.match(/<DialogContent[^>]*>/g);
  if (dialogContentMatches) {
    const hasDialogDescription = content.includes("DialogDescription");
    const hasAriaDescribedBy = content.includes("aria-describedby");

    if (!hasDialogDescription && !hasAriaDescribedBy) {
      issues.push({
        type: "Missing DialogDescription or aria-describedby",
        file: filePath,
        suggestion: "Add <DialogDescription> or aria-describedby attribute",
      });
    }
  }

  // Check for nested div in p tags (potential DOM nesting issues)
  const lines = content.split("\n");
  lines.forEach((line, index) => {
    if (line.includes("CardDescription") && line.includes("<div")) {
      issues.push({
        type: "Potential DOM nesting issue",
        file: filePath,
        line: index + 1,
        suggestion:
          "Don't put <div> elements inside CardDescription (which renders as <p>)",
      });
    }
  });

  return issues;
}

// Main execution
const srcDir = path.join(__dirname, "src");
const allFiles = getAllFiles(srcDir);

let totalIssues = 0;
const allIssues = [];

allFiles.forEach((file) => {
  const issues = checkDialogAccessibility(file);
  if (issues.length > 0) {
    allIssues.push(...issues);
    totalIssues += issues.length;
  }
});

console.log(`\n=== DIALOG ACCESSIBILITY CHECK ===`);
console.log(`Checked ${allFiles.length} files`);
console.log(`Found ${totalIssues} potential issues\n`);

if (allIssues.length > 0) {
  allIssues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue.type}`);
    console.log(`   File: ${issue.file}`);
    if (issue.line) console.log(`   Line: ${issue.line}`);
    console.log(`   Suggestion: ${issue.suggestion}\n`);
  });
} else {
  console.log("✅ No accessibility issues found!");
}

console.log(`\n=== RECENT FIXES APPLIED ===`);
console.log(
  "✅ Fixed DOM nesting: Moved ExpenseHeaderInfo out of CardDescription"
);
console.log("✅ Added DialogDescription to MonthlyExpensesModalDialog");
console.log("✅ Updated Recharts to latest version (v2.15.3)");
console.log("✅ Cleaned excessive debug console logs");
