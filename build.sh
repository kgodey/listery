webpack --mode=production --progress --colors -p
mkdir -p listery/static/listery/css/web/bootstrap/
mkdir -p listery/static/listery/css/mobile/framework7/
cp -r node_modules/bootstrap/dist/css/bootstrap.min.css* listery/static/listery/css/web/bootstrap/
cp -r node_modules/framework7/css/framework7.bundle.min.css* listery/static/listery/css/mobile/framework7/
cp listery/assets/web/css/style.css listery/static/listery/css/web/
