import assert from 'assert';
import fs from 'fs-extra';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { validateAndNormalizeAudio } from '../src/services/ffmpegService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testDir = path.join(__dirname, 'fixtures');

const mp3Path = path.join(testDir, 'test.mp3');
const wavPath = path.join(testDir, 'test.wav');
const corruptedPath = path.join(testDir, 'corrupted.mp3');
const invalidPath = path.join(testDir, 'invalid.txt');

const normalizedMp3 = path.join(testDir, 'normalized-mp3.mp3');
const normalizedWav = path.join(testDir, 'normalized-wav.mp3');

console.log('\n=== TTS Audio Validation Tests ===\n');

await fs.ensureDir(testDir);

// Generate valid MP3: 24 kHz, mono
execFileSync('ffmpeg', [
  '-y',
  '-f', 'lavfi',
  '-i', 'sine=frequency=1000:duration=2',
  '-ar', '24000',
  '-ac', '1',
  '-c:a', 'libmp3lame',
  mp3Path
], { stdio: 'ignore' });

// Generate valid WAV: 48 kHz, stereo
execFileSync('ffmpeg', [
  '-y',
  '-f', 'lavfi',
  '-i', 'sine=frequency=1000:duration=2',
  '-ar', '48000',
  '-ac', '2',
  wavPath
], { stdio: 'ignore' });

// Create deliberately corrupted audio
await fs.writeFile(
  corruptedPath,
  Buffer.from('this is not valid audio data')
);

// Create non-audio file
await fs.writeFile(
  invalidPath,
  'This is not an audio file.'
);

let failed = false;

// Test 1: MP3
try {
  const result = await validateAndNormalizeAudio(
    mp3Path,
    normalizedMp3
  );

  assert.strictEqual(result.success, true);
  assert.strictEqual(result.sampleRate, 44100);
  assert.strictEqual(result.channels, 1);
  assert(result.duration > 0);

  console.log('PASS: MP3 validation and normalization');
} catch (err) {
  failed = true;
  console.error('FAIL: MP3 validation and normalization');
  console.error(err.message);
}

// Test 2: WAV
try {
  const result = await validateAndNormalizeAudio(
    wavPath,
    normalizedWav
  );

  assert.strictEqual(result.success, true);
  assert.strictEqual(result.sampleRate, 44100);
  assert.strictEqual(result.channels, 1);
  assert(result.duration > 0);

  console.log('PASS: WAV validation and normalization');
} catch (err) {
  failed = true;
  console.error('FAIL: WAV validation and normalization');
  console.error(err.message);
}

// Test 3: Corrupted audio
try {
  await validateAndNormalizeAudio(
    corruptedPath,
    path.join(testDir, 'corrupted-output.mp3')
  );

  failed = true;
  console.error('FAIL: Corrupted audio was accepted');
} catch {
  console.log('PASS: Corrupted audio rejected');
}

// Test 4: Invalid/non-audio file
try {
  await validateAndNormalizeAudio(
    invalidPath,
    path.join(testDir, 'invalid-output.mp3')
  );

  failed = true;
  console.error('FAIL: Invalid/non-audio input was accepted');
} catch {
  console.log('PASS: Invalid/non-audio input rejected');
}

// Clean generated test fixtures
await fs.remove(testDir);

console.log('\n=== Tests Complete ===\n');

if (failed) {
  process.exitCode = 1;
}