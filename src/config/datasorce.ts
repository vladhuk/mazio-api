import mongoose from 'mongoose';

mongoose.connect(process.env.datasource_url!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
