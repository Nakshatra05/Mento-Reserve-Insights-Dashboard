#!/usr/bin/env node

/**
 * Dune Analytics Setup Script
 * This script helps validate and set up the Dune Analytics integration
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Mento Reserve Dashboard - Dune Analytics Setup\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  console.log('📝 Creating .env.local template...');
  
  const envTemplate = `# Dune Analytics API Configuration
NEXT_PUBLIC_DUNE_API_KEY=your_dune_api_key_here

# Instructions:
# 1. Get your API key from https://dune.com/settings/api
# 2. Replace 'your_dune_api_key_here' with your actual API key
# 3. Save the file and restart the development server
`;
  
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.local template');
  console.log('⚠️  Please add your Dune API key to .env.local\n');
} else {
  console.log('✅ .env.local file found');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('your_dune_api_key_here')) {
    console.log('⚠️  Please update your Dune API key in .env.local\n');
  } else {
    console.log('✅ Dune API key appears to be configured\n');
  }
}

// Check if query files exist
const queriesDir = path.join(__dirname, '..', 'dune', 'queries');
if (!fs.existsSync(queriesDir)) {
  console.log('❌ dune/queries directory not found');
  process.exit(1);
}

console.log('📊 Checking SQL query files...');
const queryFiles = [
  'test_query.sql',
  'reserve_overview.sql',
  'asset_breakdown.sql',
  'chain_comparison.sql',
  'protocol_exposure.sql',
  'historical_trends.sql'
];

let allQueriesExist = true;
queryFiles.forEach(file => {
  const filePath = path.join(queriesDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - missing`);
    allQueriesExist = false;
  }
});

if (!allQueriesExist) {
  console.log('\n❌ Some query files are missing. Please ensure all SQL files are present.');
  process.exit(1);
}

console.log('\n✅ All query files found');

// Check if query IDs are configured
const duneApiPath = path.join(__dirname, '..', 'services', 'duneApi.ts');
if (fs.existsSync(duneApiPath)) {
  const duneApiContent = fs.readFileSync(duneApiPath, 'utf8');
  if (duneApiContent.includes('1234567')) {
    console.log('\n⚠️  Query IDs still have placeholder values');
    console.log('📝 Please update the QUERY_IDS in services/duneApi.ts with your actual query IDs');
  } else {
    console.log('\n✅ Query IDs appear to be configured');
  }
}

console.log('\n📋 Next Steps:');
console.log('1. Deploy SQL queries to Dune Analytics');
console.log('2. Update query IDs in services/duneApi.ts');
console.log('3. Add your Dune API key to .env.local');
console.log('4. Run "npm run dev" to start the dashboard');
console.log('\n📖 See DUNE_SETUP_GUIDE.md for detailed instructions');

// Check if dependencies are installed
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const requiredDeps = ['axios', 'react', 'next'];
  
  console.log('\n📦 Checking dependencies...');
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - missing`);
    }
  });
}

console.log('\n🎉 Setup check complete!'); 