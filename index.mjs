import mysql from 'mysql';
const con = mysql.createConnection({
  host: 'database-producto.c9swies466uw.us-west-2.rds.amazonaws.com',
  user: 'admin',
  port:"3306",
  password: 'Sofia2024*',
  database: 'bd_producto',
});


export const handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false; // Don't wait for the event loop to be empty
// Promisify the query function for use with async/await
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    con.query(sql, params, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

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
        const idToDelete = event.queryStringParameters?.id_producto;
        if (!idToDelete) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: "El ID del producto es requerido." }),
          };
        }
        const sqlDelete = "DELETE FROM tb_producto WHERE id_producto = ?";
        await query(sqlDelete, [idToDelete]);
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