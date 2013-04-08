#!/bin/sh

sudo service tomcat7 stop
cd /var/lib/tomcat7/webapps
sudo rm -rf ROOT/
sudo rm ROOT.war
cd ~/Software/homepage
git remote update
git pull --rebase
mysql -u root -proot homepagedb < homepagedb.sql
grails war ROOT.war
sudo mv ROOT.war /var/lib/tomcat7/webapps/
sudo service tomcat7 start
sudo service apache2 restart
echo "Success!"
