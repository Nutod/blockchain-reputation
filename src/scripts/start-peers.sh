#!/bin/bash

# Chnage the directory
cd ../_data

# array=( 5001 5002 5003 )
# for i in "${array[@]}"
# do
# 	echo $i
#    PORT=$i npm run dev-peer
# done

# while read line
# do
#    echo $line
#    PORT=$line npm run dev-peer
# done < <(tail -n +2 node-ports.csv)

cust_func(){
  #wget -q "$1"
  PORT=$line npm run dev-peer
  echo "Running background? $line"
}
 
while read line
do
   cust_func "$line" &
done < <(tail -n +2 node-ports.csv)
 
wait
echo "All peers"