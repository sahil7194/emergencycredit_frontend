git pull 

rm -rf node_modules

pm2 delete 0 

rm -rf .next 

npm i 

npm run build 

pm2 start npm --name "next test" -- start

pm2 save