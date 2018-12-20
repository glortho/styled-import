#!/bin/bash

npm test
mv package{,.dev}.json
mv package{.lib,}.json
npm i

