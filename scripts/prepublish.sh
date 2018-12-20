#!/bin/bash

npm test
mv package{,.dev}.json
mv package{.npm,}.json
npm i

