#!/bin/bash

mv package{,.npm}.json
mv package{.dev,}.json
npm i
