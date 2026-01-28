/**
 * Environment validation utilities
 */

export interface EnvironmentCheck {
  valid: boolean;
  missing: string[];
  warnings: string[];
}

export function checkEnvironment(requiredVars: string[]): EnvironmentCheck {
  const result: EnvironmentCheck = {
    valid: true,
    missing: [],
    warnings: []
  };

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      result.valid = false;
      result.missing.push(varName);
    }
  }

  return result;
}

export function checkCloudinaryEnvironment(): EnvironmentCheck {
  const requiredVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];

  const result = checkEnvironment(requiredVars);

  // Add warnings for optional but recommended variables
  if (!process.env.CLOUDINARY_FOLDER) {
    result.warnings.push('CLOUDINARY_FOLDER not set - using default folder');
  }

  return result;
}

export function checkTursoEnvironment(): EnvironmentCheck {
  const requiredVars = [
    'ASTRO_DB_REMOTE_URL',
    'ASTRO_DB_APP_TOKEN'
  ];

  return checkEnvironment(requiredVars);
}

export function isRemoteMode(): boolean {
  return process.argv.includes('--remote');
}

export function isForceMode(): boolean {
  return process.argv.includes('--force');
}