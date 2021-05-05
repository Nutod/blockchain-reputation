#!/bin/bash

cd ../_data

while read line
do
   echo $line
   npx kill-port $line
done < <(tail -n +2 node-ports.csv)