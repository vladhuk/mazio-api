import dotenv from 'dotenv';
import '../../src/config/passport';
import mongoose from 'mongoose';

dotenv.config({ path: `${process.cwd()}/.env.test` });

beforeAll(() => {
  return mongoose.connect(process.env.datasource_url!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
});

beforeEach(() => {
  return mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  return mongoose.disconnect();
});
