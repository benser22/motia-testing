# Docs: Postman collection

Import `postman_collection.json` into Postman (v2.1) or similar tool.

- Import collection: `docs/postman_collection.json`.
- (Opcional) Import environment: `docs/postman_environment.json` and set `baseUrl`.

Requisitos locales:

- Docker corriendo (para Redis): `docker run -d --name redis-motia -p 6379:6379 redis || docker start redis-motia`
- Levantar motia en dev apuntando al Redis:

```powershell
$env:MOTIA_DISABLE_MEMORY_SERVER="true"; $env:MOTIA_REDIS_HOST="localhost"; npm run dev
```

Base URL por defecto en la colección: `http://localhost:3000`.

Pruebas rápidas:

- `List Pets`: GET `{{baseUrl}}/pets?status=available`
- `Get Pet`: GET `{{baseUrl}}/pets/:id` (reemplaza `:id`)
- `Create Pet`: POST `{{baseUrl}}/basic-tutorial` con body JSON.

Si quieres, puedo exportar la colección en formato compatible con Newman o añadir ejemplos adicionales para cada request.
