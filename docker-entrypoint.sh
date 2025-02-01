#!/usr/bin/env sh
set -e

# Jalankan migrasi dan seed
yarn migrate:schema
yarn migrate:seed

# Terakhir, jalankan NestJS di mode development (watch)
exec yarn start:dev
