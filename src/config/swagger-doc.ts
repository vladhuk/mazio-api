import swaggerJsdoc, { Options } from 'swagger-jsdoc';

const options: Options = {
  swaggerDefinition: {
    openapi: '3.0.3',
    info: {
      title: 'Mazio API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  securityDefinitions: {
    BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
  },
  apis: ['./src/routes/**/*.ts', './src/models/**/*.ts'],
};

const swaggerDoc = swaggerJsdoc(options);

export default swaggerDoc;
