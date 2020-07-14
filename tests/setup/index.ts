import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: `${process.cwd()}/.env.test` });

beforeAll(async () => {
  await mongoose.connect(process.env.datasource_url!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  await mongoose.connection.db.dropDatabase();
});

afterAll(() => {
  return mongoose.disconnect();
});

afterEach(() => {
  return mongoose.connection.db.dropDatabase();
});
