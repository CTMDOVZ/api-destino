const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid'); // Generar IDs únicos

const DESTINOS_TABLE = process.env.DESTINOS_TABLE;

exports.handler = async (event) => {
    try {
        // Obtener los datos del destino desde el cuerpo de la solicitud
        const body = JSON.parse(event.body);
        const item = {
            id_destino: uuid.v4(),
            ciudad: body.ciudad,
            pais: body.pais,
            descripcion: body.descripcion,
            popularidad: body.popularidad
        };

        // Validar si faltan parámetros
        if (!item.ciudad || !item.pais) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'La ciudad y el país son obligatorios' })
            };
        }

        // Guardar el destino en DynamoDB
        await dynamodb.put({
            TableName: DESTINOS_TABLE,
            Item: item
        }).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Destino creado con éxito', destino: item })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Ocurrió un error al crear el destino' })
        };
    }
};
