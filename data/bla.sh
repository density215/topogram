#!/bin/bash

ANCHOR=$1
IP_ADDR=$2
SUBNET=$3
GATEWAY=$4
[[ $ANCHOR =~ ^[[:alpha:]]{2}-[[:alpha:]]{3}-as[[:digit:]]{1,} ]] || \
    { echo "Unknown anchor name $ANCHOR"; exit 1; }

ANCHOR_DATA=$(mktemp /tmp/${ANCHOR}.json.XXXX)
API_BASE=https://atlas.ripe.net/api/v2/anchors
curl -kso $ANCHOR_DATA "${API_BASE}?search=${ANCHOR}&include=probe"

IP_ADDR=$(jq -r .results[0].ip_v4 ${ANCHOR_DATA})
NETMASK=$(jq -r .results[0].ip_v4_netmask ${ANCHOR_DATA})
GATEWAY=$(jq -r .results[0].ip_v4_gateway ${ANCHOR_DATA}) 
