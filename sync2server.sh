#!/bin/sh
rsync -azvW --exclude ".git/" ./ root@192.168.1.118:/opt/dongle-mgr.js
