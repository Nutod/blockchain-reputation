#!/bin/bash

# Chnage the directory
cd ../_data

echo "Killing peers"

kill_func(){
  npx kill-port $line
  echo "Killing port $line"
}
 
while read line
do
   kill_func "$line" &
done < <(tail -n +2 node-ports.csv)
 
wait
echo "Killed peers"