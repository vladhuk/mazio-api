import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import router from '../routes';
import swaggerDoc from './swagger-doc';

const app = express();

app.use(bodyParser.json());
app.use('/api', router);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

export default app;
