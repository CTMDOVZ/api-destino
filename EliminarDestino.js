const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const DESTINOS_TABLE = process.env.DESTINOS_TABLE;

exports.handler = async (event) => {
    try {
        // Obtener los datos del destino desde el cuerpo de la solicitud
        const body = JSON.parse(event.body);

        if (!body.id_destino || !body.ciudad) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'El ID del destino y la ciudad son obligatorios' })
            };
        }

        const params = {
            TableName: DESTINOS_TABLE,
            Key: {
                id_destino: body.id_destino,
                ciudad: body.ciudad
            }
        };

        await dynamodb.delete(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Destino eliminado con éxito' })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Ocurrió un error al eliminar el destino' })
        };
    }
};
