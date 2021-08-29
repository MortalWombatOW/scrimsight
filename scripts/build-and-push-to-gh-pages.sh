#!/bin/bash
npm run-script build
git checkout gh-pages
git add dist/
git mv -f dist/* .
git commit -m "build"
git push origin gh-pages
git clean -fd
git checkout master
