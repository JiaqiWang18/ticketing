import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

let mongo: any;
jest.setTimeout(50000);

beforeAll(async () => {
  process.env.JWT_KEY = 'test_jwt';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  // empty db
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// global sign in method to make it easy to auth

declare global {
  var signin: () => Promise<string[]>;
}

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';
  const authResponse = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);
  const cookie = authResponse.get('Set-Cookie');
  return cookie;
};
