# Documentación de la API

Esta documentación describe las rutas de la API para gestionar equipos. Las rutas están agrupadas bajo el prefijo `/api/equipos`.

## Equipos

### 1. **Crear un nuevo equipo**

- **Ruta:** `POST /api/equipos`
- **Descripción:** Crea un nuevo equipo en la base de datos.
- **Cuerpo de la solicitud (JSON):**
  ```json
  {
    "serial_number": "12345",
    "model": "Modelo del equipo",
    "oem_name": "Nombre del OEM"
  }
  ```
- **Respuesta:**
  - **Código 201:** Creación exitosa.
    ```json
    {
      "message": "Equipo creado con éxito"
    }
    ```
  - **Código 400:** Datos incompletos o inválidos.
    ```json
    {
      "message": "Campos faltantes: [mensaje]"
    }
    ```

### 2. **Actualizar un equipo existente**

- **Ruta:** `PUT /api/equipos`
- **Descripción:** Actualiza la información de un equipo existente.
- **Cuerpo de la solicitud (JSON):**
  ```json
  {
    "serial_number": "12345",
    "model": "Nuevo modelo",
    "oem_name": "Nuevo nombre del OEM",
    "active": true
  }
  ```
- **Respuesta:**
  - **Código 200:** Actualización exitosa.
    ```json
    {
      "message": "Equipo actualizado con éxito"
    }
    ```
  - **Código 400:** Datos incompletos o inválidos.
    ```json
    {
      "message": "Campos faltantes: [mensaje]"
    }
    ```
  - **Código 404:** Equipo no encontrado.
    ```json
    {
      "message": "No se encontró el equipo"
    }
    ```

### 3. **Eliminar un equipo**

- **Ruta:** `DELETE /api/equipos/:serialNumber`
- **Descripción:** Elimina un equipo de la base de datos utilizando su número de serie.
- **Parámetros:**
  - `serialNumber` (string): Número de serie del equipo a eliminar.
- **Respuesta:**
  - **Código 200:** Eliminación exitosa.
    ```json
    {
      "message": "Equipo eliminado con éxito"
    }
    ```
  - **Código 400:** El número de serie no ha sido proporcionado.
    ```json
    {
      "message": "El número de serie no ha sido proporcionado"
    }
    ```
  - **Código 404:** Equipo no encontrado.
    ```json
    {
      "message": "Equipo no encontrado"
    }
    ```

### 4. **Obtener un equipo específico**

- **Ruta:** `GET /api/equipos/:serialNumber`
- **Descripción:** Obtiene los detalles de un equipo específico utilizando su número de serie.
- **Parámetros:**
  - `serialNumber` (string): Número de serie del equipo.
- **Respuesta:**
  - **Código 200:** Retorna los detalles del equipo.
    ```json
    {
      "equipement": {
        "serial_number": "12345",
        "active": true,
        "oem_name": "Nombre del OEM",
        "model": "Modelo del equipo"
      }
    }
    ```
  - **Código 400:** El número de serie no ha sido proporcionado.
    ```json
    {
      "message": "El número de serie no ha sido proporcionado"
    }
    ```
  - **Código 404:** Equipo no encontrado.
    ```json
    {
      "message": "No se encontró el equipo"
    }
    ```
### 5. **Buscar equipos con filtros**
- **Ruta:** `GET /api/equipos`
- **Descripción:** Obtiene una lista de equipos según los filtros especificados en los parámetros de consulta.
- **Parámetros de consulta:**
  - `serialNumber` (opcional, string): Filtra por número de serie.
  - `oemName` (opcional, string): Filtra por nombre del OEM.
  - `model` (opcional, string): Filtra por modelo.
  - `equipementId` (opcional, string): Filtra por ID del equipo.
  - `active` (opcional, boolean): Filtra por estado (activo/inactivo).
  - `pageNumber` (opcional, string): Número de página para la paginación (predeterminado es `1`).
- **Respuesta:**
  - **Código 200:** Retorna una lista de equipos que coinciden con los filtros en la siguiente estructura:
    ```json
    {
      "search": {
        "totalPages": 5,
        "currentPage": 1,
        "criteria": {
          "serial_number": "12345",
          "oem_name": "Nombre del OEM"
        },
        "result": [
          {
            "serial_number": "12345",
            "active": true,
            "oem_name": "Nombre del OEM",
            "model": "Modelo del equipo"
          }
        ]
      }
    }
    ```
  - **Código 400:** Error en los parámetros de paginación.
    ```json
    {
      "message": "El número de página debe ser un número positivo válido."
    }
    ```
  - **Código 404:** No se encontraron equipos que coincidan con los filtros.
    ```json
    {
      "message": "No encontramos ningún equipo con esos filtros."
    }
    ```

### Detalles de la Respuesta de Búsqueda
- **totalPages**: Número total de páginas disponibles en los resultados de la búsqueda.
- **currentPage**: Número de la página actual en la que se encuentran los resultados.
- **criteria**: Objeto que representa los criterios de búsqueda utilizados para filtrar los resultados.
- **result**: Arreglo de instancias del tipo `Equipement` que representan los elementos encontrados.
