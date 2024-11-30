# Sistema

## Prerequisitos

Descargar NodeJS para su equipo en la
[pagina oficial](https://nodejs.org/en/)

## Desplegar en producción

Se debe configurar un archivo `.env` dentro
del proyecto etableciendo algunas variables
de entorno obligatorias y opcionales

```env
#Obligatorias
DATABASE_URL="mysql://USER:PWD@HOST:DBMS_PORT/DB_NAME"
BACKUP_DIRECTORY="./backups"

# Opcionales
PORT=63000
POOL_SIZE=5
PAGE_SIZE=10
MYSQL_BINS_PATH="C:\\xampp\\mysql\\bin"
```

Una vez configurado esto puedes ejecutar la
api puedes usar el comando

```bash
npm install --omit=dev
npm run start
```

Se creará la base de datos automaticamente

## Desplegar para desarrollo

Al igual que en [Desplegar en producción](#desplegar-en-producción)
debes definir el mismo tipo de archivo `.env` pero
para la ejecución del sistema debes hacer uso de

```bash
npm install
npm run dev
```

## Restauración

Se debe haber configurado el directorio de backups como
`./backups` y acceder con un usuario de tipo administrador

```sql
INSERT INTO User (full_name, user_name, user_password, user_type, active, email)
VALUES (
    'Administrator',         -- Nombre completo
    'admin',                 -- Nombre de usuario
    'Adm1n$tr0ng!',          -- Contraseña medianamente segura
    'ADMIN',                 -- Tipo de usuario
    1,                       -- Activo (1 = activo)
    'admin@example.com'      -- Correo electrónico
);
```

Y acceder al menú de restauración de base de datos, donde
debe aparecer el archivo creado anteriormente
