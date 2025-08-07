#!/bin/sh
set -e

# Export KINOPOISK API key into nginx variable
if [ -n "$VITE_KINOPOISK_API_KEY" ]; then
  echo "env KINOPOISK_API_KEY detected"
  # Write nginx variable file to be loaded
  echo "map \$http_host \$kinopoisk_api_key { default $VITE_KINOPOISK_API_KEY; }" > /etc/nginx/conf.d/99-api-key.conf
else
  echo "warning: VITE_KINOPOISK_API_KEY not set; /api requests will fail"
fi


