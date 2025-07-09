#!/bin/bash

echo "Starturje mysqld..."
# mysqld_safe &
usermod -d /var/lib/mysql/ mysql
service mysql start

echo "Starturje serwer nodejs..."
npm start