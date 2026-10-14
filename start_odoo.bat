@echo off
title Odoo 20 - index_file_maker
echo ========================================================
echo Starting Odoo 20 Server with index_file_maker...
echo URL: http://localhost:8069
echo Database: odoo20
echo ========================================================
"C:\Users\ajadi\odoo-dev\odoo\venv312\Scripts\python.exe" "C:\Users\ajadi\odoo-dev\odoo\odoo-bin" -c "C:\Users\ajadi\odoo-dev\odoo\odoo.conf" -d odoo20 -u index_file_maker
pause
