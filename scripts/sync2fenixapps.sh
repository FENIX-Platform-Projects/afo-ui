#!/bin/bash

SRC="fenixapps.fao.org:/logs/TOMCAT-REPOSITORY-13000/webapps/repository/skeletons/af/"
DST="../"

pause "Synchronize: $SRC to $DST"

#rsync --delete -av --progress $SRC $DST
