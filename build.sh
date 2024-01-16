#!/bin/bash
set -e

# Requires: Ruby, node, python

tput setaf 2; echo "Cleaning up..."; tput sgr0
rm ./node_modules -rf

tput setaf 2; echo "Installing markdown lint"; tput sgr0
gem install mdl || sudo gem install mdl

tput setaf 2; echo "Generating new readme and mkdocs"; tput sgr0
node ./.github/readme-generate.js

tput setaf 2; echo "Running markdown lint to check issues."; tput sgr0
mdl ./dishes ./tips -r ~MD036,~MD024,~MD004,~MD029,~MD013,~MD007

tput setaf 2; echo "Installing python requirements..."; tput sgr0
pip install -r requirements.txt --break-system-packages

tput setaf 2; echo "Builidng mkdocs and checking links..."; tput sgr0
mkdocs build --strict

tput setaf 2; echo "Installing textlint"; tput sgr0
npm install

tput setaf 2; echo "Running textlint..."; tput sgr0
./node_modules/.bin/textlint . --fix

tput setaf 2; echo "Manual rule linting..."; tput sgr0
node .github/manual_lint.js
