#! /bin/sh

# ==============================================================================
# Description: Run and build scripts
# Quasar: https://github.com/tancredi/fantasticon
# ==============================================================================

run() {
  local ret='0'
  command -v ./node_modules/fantasticon/bin/fantasticon >/dev/null 2>&1 || { local ret='1'; }

  if [ "$ret" -ne 0 ]; then
    echo "Please install fantasticon first, use 'pnpm install'"
    return 1
  fi

  run_build
  return 0
}

run_build() {
  mkdir -p dist
  ./node_modules/fantasticon/bin/fantasticon
}

## Run from here
## -----------------------------------------------------------------------------
run
