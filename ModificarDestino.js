const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const DESTINOS_TABLE = process.env.DESTINOS_TABLE;

exports.handler = async (event) => {
    try {
        // Obtener los datos del destino desde el cuerpo de la solicitud
        const body = JSON.parse(event.body);

        if (!body.id_destino) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'El ID del destino es obligatorio' })
            };
        }

        const params = {
            TableName: DESTINOS_TABLE,
            Key: {
                id_destino: body.id_destino,
                ciudad: body.ciudad
            },
            UpdateExpression: `SET 
                #pais = :pais,
                descripcion = :descripcion,
                popularidad = :popularidad`,
            ExpressionAttributeNames: {
                "#pais": "pais"
            },
            ExpressionAttributeValues: {
                ":pais": body.pais,
                ":descripcion": body.descripcion,
                ":popularidad": body.popularidad
            },
            ReturnValues: "ALL_NEW"
        };

        const result = await dynamodb.update(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Destino modificado con éxito', destino: result.Attributes })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Ocurrió un error al modificar el destino' })
        };
    }
};
