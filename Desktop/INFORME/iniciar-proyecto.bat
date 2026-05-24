@echo off
REM =====================================================
REM Script para iniciar el Proyecto INFORME
REM =====================================================
chcp 65001 > nul
setlocal enabledelayedexpansion

set PROJECT_DIR=%~dp0
cd /d "%PROJECT_DIR%"

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║     INICIAR PROYECTO INFORME                       ║
echo ╚════════════════════════════════════════════════════╝
echo.

REM Verificar si el ambiente virtual existe
if not exist "%PROJECT_DIR%.venv" (
    echo [*] Creando ambiente virtual de Python...
    python -m venv .venv
    if errorlevel 1 (
        echo [!] Error al crear el ambiente virtual
        pause
        exit /b 1
    )
)

REM Activar el ambiente virtual
echo [*] Activando ambiente virtual de Python...
call .venv\Scripts\activate.bat
if errorlevel 1 (
    echo [!] Error al activar el ambiente virtual
    pause
    exit /b 1
)

REM Instalar/actualizar dependencias de Python
echo [*] Instalando dependencias de Python...
if exist "requirements.txt" (
    pip install -r requirements.txt -q
    if errorlevel 1 (
        echo [!] Error al instalar dependencias de Python
        pause
        exit /b 1
    )
)

REM Instalar/actualizar dependencias de Node.js
if exist "package.json" (
    echo [*] Instalando dependencias de Node.js...
    if not exist "node_modules" (
        call npm install -q
    ) else (
        call npm install -q
    )
    if errorlevel 1 (
        echo [!] Advertencia: Error al instalar dependencias de Node.js
    )
)

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║     SELECCIONA UNA OPCIÓN                          ║
echo ╚════════════════════════════════════════════════════╝
echo.
echo [1] Abrir en VS Code (solo editor)
echo [2] Abrir VS Code + API Python
echo [3] Abrir VS Code + Servidor Node.js
echo [4] Abrir VS Code + Ambos servidores
echo [5] Solo inicializar ambiente (sin abrir)
echo [6] Salir
echo.

set /p opcion="Elige una opción [1-6]: "

if "%opcion%"=="1" (
    echo [*] Abriendo VS Code...
    start code .
    goto fin
)

if "%opcion%"=="2" (
    echo [*] Abriendo VS Code...
    start code .
    echo [*] Iniciando API Python...
    timeout /t 3 /nobreak
    start cmd /k "cd /d "%PROJECT_DIR%" && .venv\Scripts\python.exe app.py"
    goto fin
)

if "%opcion%"=="3" (
    echo [*] Abriendo VS Code...
    start code .
    echo [*] Iniciando servidor Node.js...
    timeout /t 3 /nobreak
    start cmd /k "cd /d "%PROJECT_DIR%" && npm start"
    goto fin
)

if "%opcion%"=="4" (
    echo [*] Abriendo VS Code...
    start code .
    echo [*] Iniciando API Python...
    timeout /t 3 /nobreak
    start cmd /k "cd /d "%PROJECT_DIR%" && .venv\Scripts\python.exe app.py"
    echo [*] Iniciando servidor Node.js...
    timeout /t 1 /nobreak
    start cmd /k "cd /d "%PROJECT_DIR%" && npm start"
    goto fin
)

if "%opcion%"=="5" (
    echo [✓] Ambiente inicializado correctamente
    echo.
    echo Puedes ejecutar:
    echo   - API Python: python app.py
    echo   - Servidor Node: npm start
    goto fin
)

if "%opcion%"=="6" (
    goto fin
)

echo [!] Opción no válida
pause

:fin
echo.
echo [✓] Operación completada
pause
