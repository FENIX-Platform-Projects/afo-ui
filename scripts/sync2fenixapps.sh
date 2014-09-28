#!/bin/bash

rsync --delete -av --progress ../ fenixapps.fao.org:/logs/TOMCAT-REPOSITORY-13000/webapps/repository/africafertilizer/
