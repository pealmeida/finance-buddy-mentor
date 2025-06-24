// Script to remove debug console.log statements after testing
// This is just for reference - you can manually remove them or run this

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

// Function to clean debug logs from a file
function cleanDebugLogs(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Patterns to remove console logs and debug statements
  const patterns = [
    // Console.log statements with debugging info
    /^\s*console\.log\(['"`].*debug.*['"`].*\);\s*$/gim,
    /^\s*console\.log\(['"`].*Debug.*['"`].*\);\s*$/gim,
    /^\s*console\.log\(['"`].*DEBUG.*['"`].*\);\s*$/gim,

    // Specific patterns from our codebase
    /^\s*console\.log\(['"`]useSessionCore:.*['"`].*\);\s*$/gim,
    /^\s*console\.log\(['"`]fetchUserProfileFromSupabase:.*['"`].*\);\s*$/gim,
    /^\s*console\.log\(['"`]Converting JSON to typed.*['"`].*\);\s*$/gim,
    /^\s*console\.log\(['"`]Converted typed data.*['"`].*\);\s*$/gim,
    /^\s*console\.log\(['"`].*Profile.*being passed.*['"`].*\);\s*$/gim,
    /^\s*console\.log\(['"`]Auth state changed.*['"`].*\);\s*$/gim,
    /^\s*console\.log\(['"`]Session.*['"`].*\);\s*$/gim,
    /^\s*console\.log\(['"`]Profile.*['"`].*\);\s*$/gim,
    /^\s*console\.log\(['"`].*savings data.*['"`].*\);\s*$/gim,
    /^\s*console\.log\(['"`].*Savings data.*['"`].*\);\s*$/gim,
    /^\s*console\.log\(['"`].*data:.*['"`].*\);\s*$/gim,

    // Multi-line console.log patterns
    /^\s*console\.log\(\s*['"`][^'"`]*['"`],\s*[^)]*\);\s*$/gim,

    // Console.warn statements
    /^\s*console\.warn\(['"`].*['"`].*\);\s*$/gim,

    // Console.error statements that are debugging (not error handling)
    /^\s*console\.error\(['"`].*debug.*['"`].*\);\s*$/gim,
  ];

  patterns.forEach((pattern) => {
    const newContent = content.replace(pattern, "");
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  });

  // Remove multiple consecutive empty lines (keep maximum 2)
  content = content.replace(/\n\s*\n\s*\n+/g, "\n\n");

  if (modified) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Cleaned debug logs from: ${filePath}`);
    return true;
  }

  return false;
}

// Main execution
const srcDir = path.join(__dirname, "src");
const allFiles = getAllFiles(srcDir);

let totalCleaned = 0;

allFiles.forEach((file) => {
  if (cleanDebugLogs(file)) {
    totalCleaned++;
  }
});

console.log(`\nCompleted! Cleaned debug logs from ${totalCleaned} files.`);

// Also check and clean specific files that commonly have logs
const specificFiles = [
  "src/App.tsx",
  "src/hooks/session/useSessionCore.ts",
  "src/utils/auth/profileFetcher.ts",
  "src/hooks/supabase/utils/savingsUtils.ts",
];

specificFiles.forEach((file) => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    if (cleanDebugLogs(fullPath)) {
      console.log(`Also cleaned: ${file}`);
    }
  }
});

console.log("=== DEBUG LOG CLEANUP REFERENCE ===");
console.log("Files with debug logs to clean up:");
console.log("- console.log() statements added for debugging");
console.log("- Lines that start with 'console.log('useInvestmentActions:'");
console.log(
  "- Lines that start with 'console.log('fetchUserProfileFromSupabase:'"
);
console.log(
  "- Lines that start with 'console.log('GoalsManagement component:'"
);

console.log("\n✨ The app will work perfectly with or without these logs!");
console.log(
  "📝 They're just helpful for debugging and can be removed for cleaner code."
);
