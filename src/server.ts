import './config';
import app from './config/app';

const port = process.env.port || 8080;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
