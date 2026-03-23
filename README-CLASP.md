# CLASP Batch Files for GSO Procurement System

This directory contains batch files to simplify clasp command execution for the GSO Procurement & Delivery System.

## Available Batch Files

### 1. clasp.bat
Simple batch file for basic clasp command execution.

**Usage:**
```batch
clasp.bat
```

**Features:**
- Checks if clasp is installed
- Shows available commands
- Interactive command input
- Error handling

### 2. clasp-notepad.bat (Recommended)
Advanced batch file with menu interface for easy operation.

**Usage:**
```batch
clasp-notepad.bat
```

**Features:**
- Menu-driven interface
- Quick access to common commands
- Project validation
- Color-coded output
- Error checking
- Loop back to menu after each operation

## Quick Start

1. **Download the batch files** from this repository
2. **Place them in your projgso directory** (same folder as .clasp.json)
3. **Double-click clasp-notepad.bat** to start using the menu

## Menu Options

| Option | Command | Description |
|--------|---------|-------------|
| 1 | clasp push | Push local changes to Google Apps Script |
| 2 | clasp pull | Pull changes from Google Apps Script |
| 3 | clasp open-script | Open Apps Script IDE in browser |
| 4 | clasp open-web-app | Open web app for testing |
| 5 | clasp status | Check sync status |
| 6 | clasp logs | View execution logs |
| 7 | Custom | Enter your own clasp command |
| 8 | Exit | Close the program |

## Requirements

- **Node.js** installed on your system
- **@google/clasp** installed globally: `npm install -g @google/clasp`
- **Authenticated** with Google: `clasp login`
- **Project configured** with .clasp.json file

## Common Workflows

### Development Workflow
1. Make changes to your files (Code.gs, Index.html, etc.)
2. Run `clasp-notepad.bat`
3. Select option 1 (push) to upload changes
4. Select option 4 (open-web-app) to test

### Testing Workflow
1. Run `clasp-notepad.bat`
2. Select option 4 (open-web-app) to open the web app
3. Test functionality in browser
4. Select option 6 (logs) to check for errors

### Deployment Workflow
1. Ensure all changes are pushed (option 1)
2. Run `clasp-notepad.bat`
3. Select option 7 and enter: `deploy`
4. Follow deployment prompts

## Troubleshooting

### "clasp is not installed"
- Run: `npm install -g @google/clasp`
- Restart the batch file

### ".clasp.json not found"
- Make sure you're in the correct projgso directory
- Check that the file exists in the current folder

### Authentication issues
- Run: `clasp login`
- Follow the Google authentication process

### Push/Pull conflicts
- Use option 5 (status) to check current state
- Consider using option 2 (pull) before pushing changes

## Integration with Notepad++

You can integrate these batch files with Notepad++ for easy development:

1. **Open Notepad++**
2. **Go to Run > Run... (F5)**
3. **Enter**: `"D:\Program Files\projgso\clasp-notepad.bat"`
4. **Save as**: "CLASP Push"
5. **Assign shortcut** (e.g., Ctrl+Shift+P)

Now you can run clasp commands directly from Notepad++!

## File Locations

- **Project Directory**: `D:\Program Files\projgso\`
- **Batch Files**: 
  - `clasp.bat` - Basic version
  - `clasp-notepad.bat` - Advanced menu version
- **Configuration**: `.clasp.json`
- **Source Files**: `Code.gs`, `Index.html`, `appsscript.json`

## Support

For issues with:
- **Batch files**: Check this README or create GitHub issue
- **clasp commands**: Refer to Google Apps Script documentation
- **Project functionality**: Check main project README.md

---

**Repository**: https://github.com/251805/projgso.git  
**Project**: GSO Procurement & Delivery System  
**Version**: v6.2 with GSOID# system
