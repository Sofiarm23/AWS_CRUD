<div align="center">

# ☁︎ AWS CRUD PRODUCTO

</div>

# INTRODUCCIÓN

Este repositorio contiene un ejemplo de una API CRUD que permite recuperar, agregar, actualizar y eliminar productos en la base de datos, utilizando los servicios de AWS como RDS, Lambda y API Gateway, así mismo, las herramientas MySQL Workbench y Postman.

## 1. RDS

### 1.1. Creación de la base de datos

![image](https://github.com/user-attachments/assets/ff48fb26-c10c-461d-b303-07c135edeaa4)

### 1.2. Configuración de RDS

![image](https://github.com/user-attachments/assets/eb63ba56-117a-47a1-b031-6d660ef2217f)

## 2. LAMBDA

### 2.1. Creación de la función lambda (Deploy)
```
import mysql from 'mysql';

const con = mysql.createConnection({
  host: 'database.....amazonaws.com',
  user: 'user_name',
  port: "3306",
  password: 'password',
  database: 'database_name',
});

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; // Don't wait for the event loop to be empty

  // Promisify the query function for use with async/await
  const query = (sql, params) => new Promise((resolve, reject) => {
    con.query(sql, params, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });

  try {
    switch (event.httpMethod) {
      case 'POST':
        const { id_producto, nombre, precio, descripcion } = JSON.parse(event.body);
        const sqlPost = "INSERT INTO tb_producto (id_producto, nombre, precio, descripcion) VALUES (?, ?, ?, ?)";
        await query(sqlPost, [id_producto, nombre, precio, descripcion]);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Producto registrado exitosamente.' }),
        };

      case 'GET':
        const sqlGet = "SELECT * FROM tb_producto";
        const results = await query(sqlGet);
        return {
          statusCode: 200,
          body: JSON.stringify(results),
        };

      case 'PUT':
        const { id_producto: updateId, nombre: updateNombre, precio: updatePrecio, descripcion: updateDescripcion } = JSON.parse(event.body);
        const sqlPut = "UPDATE tb_producto SET nombre = ?, precio = ?, descripcion = ? WHERE id_producto = ?";
        await query(sqlPut, [updateNombre, updatePrecio, updateDescripcion, updateId]);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Producto actualizado exitosamente.' }),
        };

      case 'DELETE':
        const { id_producto: deleteId } = JSON.parse(event.body);
        if (!deleteId) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: "El ID del producto es requerido." }),
          };
        }
        const sqlDelete = "DELETE FROM tb_producto WHERE id_producto = ?";
        await query(sqlDelete, [deleteId]);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Producto eliminado exitosamente.' }),
        };

      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ message: 'Método no permitido.' }),
        };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error: ' + err.message }),
    };
  }
};
```

### 2.2. Configuración de la lambda

![image](https://github.com/user-attachments/assets/b5afc1a9-bccc-46a2-a6cd-ef0ad9bb1136)

## 3. API GATEWAY

### 3.1. Deploy API

![image](https://github.com/user-attachments/assets/2ccbe0a1-2036-47cf-aa41-77284cb43f9f)

### 3.2. Configuración del API Gateway

![image](https://github.com/user-attachments/assets/3cf92153-2b03-4194-b7b4-adfba6debeae)

### 3.3. Habilitar CORS

![image](https://github.com/user-attachments/assets/2752a942-ff62-4c97-9950-18277aeb483f)

### 3.4. Editar solicitud de integración (Proxy)

![image](https://github.com/user-attachments/assets/11bf1111-d44d-438c-92ae-2f6dc9fb80d2)

## 4. POSTMAN

### 4.1. MÉTODO POST

![image](https://github.com/user-attachments/assets/6a852d2e-34d0-4782-93c7-e950458828e2)

### 4.2. MÉTODO GET

![image](https://github.com/user-attachments/assets/a3e4a028-2674-4420-b9eb-1d266ea4a25b)

### 4.3. MÉTODO PUT

![image](https://github.com/user-attachments/assets/0c44df20-9068-4eb1-90bd-412d9bf311b9)

### 4.4. MÉTODO DELETE

![image](https://github.com/user-attachments/assets/a9df5e4a-eeed-4d31-b3e4-44b5eae6f50b)

## 5. ERRORES Y SOLUCIONES
- Error de conexión en la base de datos

![image](https://github.com/user-attachments/assets/9e399517-f72b-4b61-8e83-db7cf2d5aaa7)

- La configuración en RDS no estaba en público

![image](https://github.com/user-attachments/assets/08df7674-a9ee-4fea-ab40-cb6f1a9eeaaa)

- Error en las pruebas de postman, lo metodos no arrojaban los valores que correspondían a las sentencias. 

![WhatsApp Image 2024-08-11 at 7 38 57 PM](https://github.com/user-attachments/assets/913e2e92-2ca0-498c-9fa2-5ae54ed2df25)

- El nombre de la base de datos creada en MySQL no coincidía con el nombre de la base de datos en el codigo del Lambda.

![image](https://github.com/user-attachments/assets/92b54577-3ec1-4ab0-8448-3f9241627ea0)
![image](https://github.com/user-attachments/assets/d3e9661c-3061-44c0-a5bd-07e4fe1b50c6)





