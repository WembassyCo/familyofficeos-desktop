#!/bin/bash
# Wren Heartbeat Wrapper - Sets up proper environment

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export HOME="/Users/chrismcintosh"

# Run heartbeat - correct syntax
/opt/homebrew/bin/openclaw agent --agent coo -m "HEARTBEAT"
