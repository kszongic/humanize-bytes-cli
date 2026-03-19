# @kszongic/humanize-bytes-cli

[![npm version](https://img.shields.io/npm/v/@kszongic/humanize-bytes-cli)](https://www.npmjs.com/package/@kszongic/humanize-bytes-cli)
[![license](https://img.shields.io/npm/l/@kszongic/humanize-bytes-cli)](./LICENSE)

> Convert byte counts to human-readable strings (KB, MB, GB…) and back. Zero dependencies.

## Install

```bash
npm i -g @kszongic/humanize-bytes-cli
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

## License

MIT © [kszongic](https://github.com/kszongic)
