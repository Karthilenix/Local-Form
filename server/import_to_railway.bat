@echo off
echo Importing database to Railway...
mysql --host=mysql.railway.internal --port=3306 --user=root --password=qaLbFkSxHFJbJHszWkapaqRHaLagYhbP railway < railway_backup.sql
echo Import complete!
