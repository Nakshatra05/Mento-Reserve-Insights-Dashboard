import { RESERVE_ADDRESS_CONFIGS } from './config/addresses';
import { Chain, AddressCategory, ReserveAddressConfig } from './types';

function checkRequiredFields(config: ReserveAddressConfig): string[] {
  const missing: string[] = [];
  if (!config.address) missing.push('address');
  if (!config.chain) missing.push('chain');
  if (!config.category) missing.push('category');
  if (!config.label) missing.push('label');
  if (!config.assets) missing.push('assets');
  if (!config.description) missing.push('description');
  return missing;
}

function checkDuplicates(configs: ReserveAddressConfig[]): string[] {
  const seen = new Set<string>();
  const duplicates: string[] = [];
  for (const c of configs) {
    const key = `${c.address.toLowerCase()}_${c.chain}`;
    if (seen.has(key)) {
      duplicates.push(key);
    } else {
      seen.add(key);
    }
  }
  return duplicates;
}

function checkAssetsNotEmpty(config: ReserveAddressConfig): boolean {
  return Array.isArray(config.assets) && config.assets.length > 0;
}

function main() {
  let allPassed = true;

  // 1. Check required fields
  RESERVE_ADDRESS_CONFIGS.forEach((config, idx) => {
    const missing = checkRequiredFields(config);
    if (missing.length > 0) {
      allPassed = false;
      console.error(`Entry #${idx} is missing fields: ${missing.join(', ')}`);
    }
  });

  // 2. Check for duplicate address+chain
  const duplicates = checkDuplicates(RESERVE_ADDRESS_CONFIGS);
  if (duplicates.length > 0) {
    allPassed = false;
    console.error(`Duplicate address+chain combinations found: ${duplicates.join('; ')}`);
  }

  // 3. Check assets array not empty
  RESERVE_ADDRESS_CONFIGS.forEach((config, idx) => {
    if (!checkAssetsNotEmpty(config)) {
      allPassed = false;
      console.error(`Entry #${idx} has an empty assets array.`);
    }
  });

  if (allPassed) {
    console.log('All checks passed!');
  } else {
    console.error('Some checks failed. See above for details.');
  }
}

main(); 