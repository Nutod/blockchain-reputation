#!/bin/bash

# Chnage the directory
cd ../_data

# PORT=5001 npm run dev-peer
while read line
do
   echo $line
   # start the server here
done < <(tail -n +2 node-ports.csv)