@echo off
echo Moving DBMS...
move /Y "frontend\app\dashboard\dbms" "frontend\app\(roles)\student\dashboard\"
if %errorlevel% neq 0 echo Failed to move DBMS

echo Moving DLD...
move /Y "frontend\app\dashboard\dld" "frontend\app\(roles)\student\dashboard\"
if %errorlevel% neq 0 echo Failed to move DLD

echo Listing Destination:
dir "frontend\app\(roles)\student\dashboard"
