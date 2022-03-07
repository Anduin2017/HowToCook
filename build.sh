#!/bin/bash
set -e

# Requires: Ruby, node, python

tput setaf 2; echo "Cleaning up..."; tput setaf 0
rm ./node_modules -rf

tput setaf 2; echo "Installing markdown lint"; tput setaf 0
gem install mdl

tput setaf 2; echo "Generating new readme and mkdocs"; tput setaf 0
node ./.github/readme-generate.js

tput setaf 2; echo "Running markdown lint to check issues."; tput setaf 0
mdl ./dishes ./tips -r ~MD036,~MD024,~MD004,~MD029

tput setaf 2; echo "Installing python requirements..."; tput setaf 0
pip install -r requirements.txt

tput setaf 2; echo "Builidng mkdocs and checking links..."; tput setaf 0
mkdocs build --strict

tput setaf 2; echo "Installing textlint"; tput setaf 0
npm install

tput setaf 2; echo "Running textlint..."; tput setaf 0
./node_modules/.bin/textlint . --fix