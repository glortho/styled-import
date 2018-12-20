#!/bin/bash

mv package{,.lib}.json
mv package{.dev,}.json
npm i
