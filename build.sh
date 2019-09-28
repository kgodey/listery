webpack --mode=production --progress --colors -p
mkdir -p listery/static/listery/css/bootstrap/
mkdir -p listery/static/listery/css/framework7/
cp -r node_modules/bootstrap/dist/css/bootstrap.min.css* listery/static/listery/css/bootstrap/
cp -r node_modules/framework7/css/framework7.bundle.min.css* listery/static/listery/css/framework7/
cp assets/css/style.css listery/static/listery/css/
