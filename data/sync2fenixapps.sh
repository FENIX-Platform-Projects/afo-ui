#!/bin/bash

SRC="../"
DST="fenixapps.fao.org:/logs/TOMCAT-REPOSITORY-13000/webapps/repository/skeletons/af_beta/"

pause "Synchronize: $SRC to $DST"

#rsync --delete -av --progress $SRC $DST
