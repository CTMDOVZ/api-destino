const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid'); // Generar IDs únicos

const DESTINOS_TABLE = process.env.DESTINOS_TABLE;

exports.handler = async (event) => {
    try {
        // Obtener los datos del destino desde el cuerpo de la solicitud
        const body = JSON.parse(event.body);

        // Validar que los datos requeridos estén presentes
        if (!body.ciudad || !body.pais) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'La ciudad y el país son obligatorios' })
            };
        }

        // Crear el ítem de destino con un ID único
        const item = {
            id_destino: uuid.v4(),
            ciudad: body.ciudad,
            pais: body.pais,
            descripcion: body.descripcion || 'Descripción no proporcionada',
            popularidad: body.popularidad || 5 // Valor por defecto si no se proporciona
        };

        // Guardar el destino en DynamoDB
        const params = {
            TableName: DESTINOS_TABLE,
            Item: item
        };

        // Intentar poner el ítem en DynamoDB
        await dynamodb.put(params).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Destino creado con éxito', destino: item })
        };
    } catch (error) {
        console.error('Error al crear el destino:', error);

        // Manejo específico de error para problemas de DynamoDB
        if (error.code === 'ConditionalCheckFailedException') {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'La operación no cumplió con las condiciones requeridas.' })
            };
        }

        // Errores generales
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Ocurrió un error al crear el destino.',
                error: error.message || 'Error desconocido'
            })
        };
    }
};
