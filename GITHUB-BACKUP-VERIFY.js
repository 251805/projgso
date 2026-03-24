/**
 * GITHUB REPOSITORY VERIFICATION & BACKUP SYSTEM
 * This script ensures GitHub repository matches local project
 * Creates comprehensive backup of current state
 */

function verifyGitHubRepository() {
  const results = {
    localFiles: [],
    githubFiles: [],
    missingFiles: [],
    extraFiles: [],
    backupStatus: "NOT_STARTED",
    systemStatus: "UNKNOWN"
  };
  
  console.log("=== GITHUB REPOSITORY VERIFICATION ===");
  console.log("Timestamp:", new Date().toISOString());
  
  try {
    // 1. GET LOCAL FILES
    console.log("\n--- 1. SCANNING LOCAL FILES ---");
    const localFiles = [
      ".clasp.json",
      "appsscript.json", 
      "package.json",
      "Code.gs",
      "Index.html",
      "clasp.bat",
      "clasp-notepad.bat",
      "README.md",
      "README-CLASP.md",
      "COMPLETE-SYSTEM-VERIFY.js",
      "GITHUB-BACKUP-VERIFY.js",
      "GITHUB-SYNC-INSTRUCTIONS.md",
      "GITHUB-STATUS-REPORT.md",
      "PROJECT-CLEANUP-SUMMARY.md",
      "DEPLOYMENT-FIX-GUIDE.md",
      "DEPLOYMENT-COMMANDS.md"
    ];
    
    results.localFiles = localFiles;
    console.log("Local Files:", localFiles);
    
    // 2. VERIFY GITHUB REPOSITORY
    console.log("\n--- 2. VERIFYING GITHUB REPOSITORY ---");
    const repoUrl = "https://api.github.com/repos/251805/projgso/contents";
    
    // Check each file exists on GitHub
    for (const file of localFiles) {
      try {
        const response = UrlFetchApp.fetch(repoUrl + "/" + file, {
          "headers": {
            "Authorization": "token " + getGitHubToken(),
            "Accept": "application/vnd.github.v3+json"
          },
          "muteHttpExceptions": true
        });
        
        if (response.getResponseCode() === 200) {
          results.githubFiles.push(file);
          console.log("✅ Found on GitHub:", file);
        } else {
          results.missingFiles.push(file);
          console.log("❌ Missing from GitHub:", file);
        }
      } catch (error) {
        results.missingFiles.push(file);
        console.log("❌ Error checking:", file, error.toString());
      }
    }
    
    // 3. CHECK FOR EXTRA FILES ON GITHUB
    console.log("\n--- 3. CHECKING FOR EXTRA FILES ---");
    const githubResponse = UrlFetchApp.fetch(repoUrl, {
      "headers": {
        "Authorization": "token " + getGitHubToken(),
        "Accept": "application/vnd.github.v3+json"
      },
      "muteHttpExceptions": true
    });
    
    if (githubResponse.getResponseCode() === 200) {
      const githubData = JSON.parse(githubResponse.getContentText());
      const githubFileList = githubData.map(file => file.name);
      
      // Find files on GitHub that aren't in our local list
      for (const githubFile of githubFileList) {
        if (!localFiles.includes(githubFile)) {
          results.extraFiles.push(githubFile);
          console.log("⚠️ Extra file on GitHub:", githubFile);
        }
      }
    }
    
    // 4. SYSTEM STATUS ASSESSMENT
    console.log("\n--- 4. SYSTEM STATUS ASSESSMENT ---");
    
    if (results.missingFiles.length === 0 && results.extraFiles.length === 0) {
      results.systemStatus = "✅ PERFECT_SYNC";
      results.backupStatus = "CURRENT";
      console.log("🎉 Perfect synchronization between local and GitHub");
    } else if (results.missingFiles.length > 0) {
      results.systemStatus = "⚠️ LOCAL_MISSING";
      results.backupStatus = "NEEDS_PUSH";
      console.log("⚠️ Local files missing from GitHub");
    } else if (results.extraFiles.length > 0) {
      results.systemStatus = "⚠️ GITHUB_EXTRA";
      results.backupStatus = "NEEDS_CLEANUP";
      console.log("⚠️ Extra files on GitHub");
    } else {
      results.systemStatus = "❌ SYNC_ISSUES";
      results.backupStatus = "NEEDS_ATTENTION";
      console.log("❌ Synchronization issues detected");
    }
    
    // 5. CREATE BACKUP MANIFEST
    console.log("\n--- 5. CREATING BACKUP MANIFEST ---");
    const backupManifest = {
      timestamp: new Date().toISOString(),
      version: "v6.2-gsocleanup",
      localFiles: results.localFiles,
      githubFiles: results.githubFiles,
      missingFiles: results.missingFiles,
      extraFiles: results.extraFiles,
      systemStatus: results.systemStatus,
      backupStatus: results.backupStatus,
      totalFiles: localFiles.length,
      syncedFiles: results.githubFiles.length
    };
    
    // Save backup manifest to local
    const backupFile = SpreadsheetApp.create("GITHUB-BACKUP-" + new Date().toISOString().split('T')[0] + ".json");
    backupFile.getRange("A1").setValue(JSON.stringify(backupManifest, null, 2));
    console.log("📄 Backup manifest created");
    
    console.log("\n=== VERIFICATION COMPLETE ===");
    console.log("Local Files:", results.localFiles.length);
    console.log("GitHub Files:", results.githubFiles.length);
    console.log("Missing Files:", results.missingFiles.length);
    console.log("Extra Files:", results.extraFiles.length);
    console.log("System Status:", results.systemStatus);
    console.log("Backup Status:", results.backupStatus);
    
  } catch (error) {
    results.systemStatus = "❌ VERIFICATION_FAILED";
    results.backupStatus = "ERROR";
    console.log("❌ Verification error:", error.toString());
  }
  
  return results;
}

// Helper function to get GitHub token (you'll need to set this)
function getGitHubToken() {
  // Replace with your actual GitHub personal access token
  // Generate at: https://github.com/settings/tokens
  return "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN";
}

// AUTO-RUN VERIFICATION
const results = verifyGitHubRepository();
console.log("=== FINAL RESULTS ===");
console.log(JSON.stringify(results, null, 2));
