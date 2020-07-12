import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: `${process.cwd()}/.env.test` });

beforeAll(() => {
  return mongoose.connect(process.env.datasource_url!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(() => {
  return mongoose.disconnect();
});

afterEach(() => {
  return mongoose.connection.db.dropDatabase();
});
