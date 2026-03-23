# GSO Procurement & Delivery System

A comprehensive Google Apps Script-based procurement and delivery management system for municipality operations.

## Features

- **Dual Module System**: Purchase Request and Delivery Checking modules
- **GSOID# System**: Auto-generated unique identifiers (format: GSO MMDDYY-XXX)
- **PR# Optional Field**: Optional purchase request reference field
- **Real-time Sync**: Live synchronization with Google Sheets database
- **Document Generation**: Automatic creation of purchase and delivery documents
- **Role-based Access**: Admin and Guest user modes
- **Modern UI**: Responsive design with Tailwind CSS

## System Architecture

### Main Components
- **Code.gs**: Backend Google Apps Script functions
- **Index.html**: Frontend web application interface
- **appsscript.json**: Google Apps Script configuration
- **package.json**: Node.js project configuration for clasp

### Database Structure
- **PR_DATABASE**: Purchase request records with GSOID# as primary key
- **DR_DATABASE**: Delivery records linked by GSOID#

### Field Mapping
- **GSOID#**: Primary system identifier (auto-generated)
- **PR#**: Optional purchase request reference
- **Budget#**: Optional budget reference
- **BAC#**: Optional BAC reference

## Setup Instructions

### Prerequisites
- Node.js installed
- Google Apps Script CLI (clasp) installed
- Google Apps Script API enabled

### Installation
1. Clone this repository
2. Run `npm install` (if dependencies exist)
3. Authenticate with Google: `clasp login`
4. Clone the Apps Script project using the provided Script ID
5. Push changes: `clasp push`

### Usage
- **Development**: Make changes locally, then `clasp push` to sync
- **Testing**: Use `clasp open-web-app` to test the web application
- **Monitoring**: Check `clasp logs` for execution logs

## File Structure
```
projgso/
├── .clasp.json          # clasp configuration
├── Code.gs              # Main Apps Script backend
├── Index.html           # Web application frontend
├── appsscript.json      # Apps Script manifest
├── package.json         # Node.js project config
└── README.md           # This file
```

## Version History
- **v6.2**: Implemented GSOID# as main identifier, PR# as optional field
- **v6.1**: Previous version with PR# as main identifier

## Author
Municipality GSO - Automated Procurement System

## License
Internal Use Only - Municipality Property
