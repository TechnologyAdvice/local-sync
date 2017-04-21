#!/bin/sh

# configure git
echo "...configuring git"
git config --global user.name "deweybot"
git config --global user.email "deweybot+devteam@technologyadvice.com"

# changelog
ta-script circle_ci/create_changelog

# gh-pages
echo "...deploying gh-pages"
npm run build:docs
gh-pages -d docs/dist -m 'deploy docs [ci skip]'

# s3 sync
echo "...syncing with s3"
npm run build:umd
$(npm bin)/ta-script aws/s3_sync -d ./dist/umd -b cdn.taplatform.net/local-sync/$($(npm bin)/json -f package.json version)
