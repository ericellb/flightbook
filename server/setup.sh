composer install
npm install
cp .env.example .env
touch database/database.sqlite
php artisan migrate
php artisan db:seed