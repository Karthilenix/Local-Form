@echo off
echo Importing database to Railway...
mysql --host=junction.proxy.rlwy.net --port=46459 --user=root --password=qaLbFkSxHFJbJHszWkapaqRHaLagYhbP railway < railway_backup.sql
echo Import complete!
