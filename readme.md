# @kszongic/humanize-bytes-cli

[![npm version](https://img.shields.io/npm/v/@kszongic/humanize-bytes-cli)](https://www.npmjs.com/package/@kszongic/humanize-bytes-cli)
[![npm downloads](https://img.shields.io/npm/dm/@kszongic/humanize-bytes-cli)](https://www.npmjs.com/package/@kszongic/humanize-bytes-cli)
[![license](https://img.shields.io/npm/l/@kszongic/humanize-bytes-cli)](./LICENSE)
![node](https://img.shields.io/node/v/@kszongic/humanize-bytes-cli)
![zero deps](https://img.shields.io/badge/dependencies-0-brightgreen)

> Convert byte counts to human-readable strings (KB, MB, GB…) and back. Zero dependencies.

## Why?

Raw byte counts are everywhere — `du`, `ls -l`, `df`, CI logs, cloud billing APIs — but `1073741824` means nothing at a glance. `humanize-bytes` turns it into `1.07 GB` (or `1 GiB` if you prefer IEC). It also goes the other way: feed it `4.5TB` and get `4500000000000`.

No runtime dependencies. Works on Linux, macOS, and Windows. Plays nicely with pipes.

## Install

```bash
npm i -g @kszongic/humanize-bytes-cli
```

Or run without installing:

```bash
npx @kszongic/humanize-bytes-cli 1048576
```

## Usage

```bash
# Bytes → human-readable (SI, base 1000)
humanize-bytes 1048576          # 1.05 MB
humanize-bytes 1073741824       # 1.07 GB

# IEC units (base 1024)
humanize-bytes 1048576 --iec    # 1 MiB
humanize-bytes 1073741824 --iec # 1 GiB

# Human-readable → bytes
humanize-bytes 1.5GB -b         # 1500000000
humanize-bytes 2MiB --to-bytes  # 2097152

# Pipe from stdin
echo 4096 | humanize-bytes      # 4.1 KB
du -sb /tmp | cut -f1 | humanize-bytes

# Custom decimals
humanize-bytes 123456789 -d 4   # 123.4568 MB
```

## Options

| Flag | Description |
|------|-------------|
| `--si` | SI units (KB, MB) base 1000 *(default)* |
| `--iec` | IEC units (KiB, MiB) base 1024 |
| `--to-bytes`, `-b` | Parse human string to raw bytes |
| `--decimals`, `-d` | Number of decimal places (default: 2) |
| `-v`, `--version` | Show version |
| `-h`, `--help` | Show help |

## Real-World Use Cases

### Disk usage reports

```bash
# Make du output readable
du -sb * | while read bytes name; do
  echo "$(echo $bytes | humanize-bytes) $name"
done
```

### CI/CD artifact sizes

```bash
# Show build output sizes in GitHub Actions logs
SIZE=$(stat -c%s dist/bundle.js)
echo "Bundle size: $(humanize-bytes $SIZE)"
```

### Cloud cost analysis

```bash
# Convert S3 object sizes from API output
aws s3api list-objects --bucket my-bucket --query 'Contents[].Size' \
  | jq '.[]' | while read b; do humanize-bytes $b; done
```

### Docker image inspection

```bash
docker image inspect myapp:latest --format '{{.Size}}' | humanize-bytes --iec
```

### Log analysis

```bash
# Find large log entries
awk '{print $NF}' access.log | sort -n | tail -5 | while read b; do humanize-bytes $b; done
```

## Comparison

| Feature | humanize-bytes-cli | `numfmt` (GNU) | `pretty-bytes` (npm) |
|---------|-------------------|----------------|---------------------|
| Zero dependencies | ✅ | ✅ (system) | ❌ (1 dep) |
| CLI-first | ✅ | ✅ | ❌ (library) |
| Reverse (string → bytes) | ✅ `--to-bytes` | ✅ `--from` | ❌ |
| SI + IEC units | ✅ | ✅ | SI only |
| Cross-platform | ✅ | Linux/macOS | ✅ |
| Custom decimals | ✅ | ✅ | ✅ |
| Stdin piping | ✅ | ✅ | ❌ |
| Windows native | ✅ | ❌ | ❌ |

> `numfmt` is great but isn't available on Windows. `humanize-bytes-cli` works everywhere Node runs.

## Related Tools

- [`freq-table-cli`](https://github.com/kszongic/freq-table-cli) — Frequency tables from stdin
- [`gzip-cli`](https://github.com/kszongic/gzip-cli) — Gzip/gunzip from the command line
- [`glob-size-cli`](https://github.com/kszongic/glob-size-cli) — Check file sizes by glob pattern

## License

MIT © [kszongic](https://github.com/kszongic)
