# Sistema

## Desplegar en producción

Se debe configurar un archivo `.env` dentro
del proyecto etableciendo algunas variables
de entorno obligatorias y opcionales

```env
#Obligatorias
DATABASE_URL="mysql://USER:PWD@HOST:DBMS_PORT/DB_NAME"

# Opcionales
PORT=63000
POOL_SIZE=5
```

Una vez configurado esto puedes ejecutar la
api puedes usar el comando

```bash
npm install --omit=dev
npm run start
```

## Desplegar para desarrollo

Al igual que en [Desplegar en producción](#desplegar-en-producción)
debes definir el mismo tipo de archivo `.env` pero
para la ejecución del sistema debes hacer uso de

```bash
npm install
npm run dev
```
