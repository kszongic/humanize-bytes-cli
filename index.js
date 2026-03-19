#!/usr/bin/env node
'use strict';

const UNITS_SI = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
const UNITS_IEC = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB'];

function humanize(bytes, { si = true, decimals = 2 } = {}) {
  const base = si ? 1000 : 1024;
  const units = si ? UNITS_SI : UNITS_IEC;
  if (bytes === 0) return '0 B';
  const sign = bytes < 0 ? '-' : '';
  let abs = Math.abs(bytes);
  let i = 0;
  while (abs >= base && i < units.length - 1) { abs /= base; i++; }
  return sign + abs.toFixed(decimals).replace(/\.?0+$/, '') + ' ' + units[i];
}

function parse(str) {
  const m = str.trim().match(/^(-?\d+(?:\.\d+)?)\s*(b|k(?:i?b)?|m(?:i?b)?|g(?:i?b)?|t(?:i?b)?|p(?:i?b)?|e(?:i?b)?)?$/i);
  if (!m) { process.stderr.write('Error: cannot parse "' + str + '"\n'); process.exit(1); }
  const num = parseFloat(m[1]);
  const unit = (m[2] || 'b').toLowerCase().replace(/b$/, '');
  const map = { '': 1, k: 1000, ki: 1024, m: 1e6, mi: 1048576, g: 1e9, gi: 1073741824, t: 1e12, ti: Math.pow(1024, 4), p: 1e15, pi: Math.pow(1024, 5), e: 1e18, ei: Math.pow(1024, 6) };
  const factor = map[unit] || 1;
  return Math.round(num * factor);
}

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  console.log(`Usage: humanize-bytes <value> [options]

Convert bytes to human-readable or parse human strings to bytes.

Arguments:
  <value>          Number of bytes, or human string like "1.5GB"

Options:
  --iec            Use IEC units (KiB, MiB) with base 1024
  --si             Use SI units (KB, MB) with base 1000 (default)
  --to-bytes, -b   Parse human string to bytes
  --decimals, -d   Decimal places (default: 2)
  -h, --help       Show help
  -v, --version    Show version

Examples:
  humanize-bytes 1048576           → 1.05 MB
  humanize-bytes 1048576 --iec     → 1 MiB
  humanize-bytes 1.5GB --to-bytes  → 1500000000
  echo 4096 | humanize-bytes       → 4.1 KB`);
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  console.log(require('./package.json').version);
  process.exit(0);
}

const iec = args.includes('--iec');
const toBytes = args.includes('--to-bytes') || args.includes('-b');
let decimals = 2;
const di = args.indexOf('--decimals') !== -1 ? args.indexOf('--decimals') : args.indexOf('-d');
if (di !== -1 && args[di + 1]) decimals = parseInt(args[di + 1], 10);

const optFlags = new Set(['--iec', '--si', '--to-bytes', '-b', '--decimals', '-d', '--help', '-h', '--version', '-v']);
const values = args.filter((a, i) => !optFlags.has(a) && !(i > 0 && (args[i - 1] === '--decimals' || args[i - 1] === '-d')));

function run(input) {
  if (toBytes) {
    console.log(parse(input));
  } else {
    const n = Number(input);
    if (isNaN(n)) { console.log(parse(input) + ' B (bytes)'); return; }
    console.log(humanize(n, { si: !iec, decimals }));
  }
}

if (values.length > 0) {
  values.forEach(run);
} else {
  let buf = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', d => buf += d);
  process.stdin.on('end', () => buf.trim().split(/\n/).filter(Boolean).forEach(run));
}
