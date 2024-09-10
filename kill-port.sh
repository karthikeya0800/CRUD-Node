#!/bin/bash

if [ $# -eq 0 ]; then
    echo "Usage: $0 <port_number>"
    exit 1
fi

port=$1

if sudo kill $(sudo lsof -t -i:$port) 2>/dev/null; then
    echo "Successfully killed process using port $port"
else
    echo "No process found using port $port"
fi