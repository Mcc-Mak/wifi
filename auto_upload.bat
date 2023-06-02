@echo off
curl https://www.ogcio.gov.hk/en/our_work/community/common_wifi_branding/fixed-wi-fi-hk-locations.json -o fixed-wi-fi-hk-locations.json
curl https://www.ogcio.gov.hk/en/our_work/community/common_wifi_branding/non-fixed-wi-fi-hk-locations.json -o non-fixed-wi-fi-hk-locations.json
set timestamp_now=%date:~6,4%-%date:~0,2%-%date:~3,2%T%time:~0,8%
echo %timestamp_now: =0% > modified_datetime.log
git add -A
REM git reset -- auto_upload.bat
git commit -m "[auto] git-push"
git push https://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@github.com/Mcc-Mak/wifi.git
@echo on