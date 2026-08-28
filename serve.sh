#!/bin/sh
# Serve the Weel prototype on http://localhost:5050
cd "$(dirname "$0")"
echo "Weel prototype → http://localhost:5050"
exec python3 -m http.server 5050
