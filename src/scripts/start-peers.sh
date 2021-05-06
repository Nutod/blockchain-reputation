#!/bin/bash

# Chnage the directory
cd ../_data

echo "Starting up peers"

start_func(){
  PORT=$line npm run dev-peer
  echo "Starting $line"
}
 
while read line
do
   start_func "$line" &
done < <(tail -n +2 node-ports.csv)
 
wait
echo "All peers"