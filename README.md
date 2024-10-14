# Sistema

## Desplegar

Se debe configurar un archivo `.env` dentro
del proyecto etableciendo algunas variables
de entorno obligatorias y opcionales

```env
#Obligatorias
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

# Opcionales
PORT=63000
```

Una vez configurado esto puedes ejecutar la
api puedes usar el comando

```bash
npm run start
```
