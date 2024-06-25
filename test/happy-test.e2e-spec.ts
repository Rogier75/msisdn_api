import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import * as mongoose from 'mongoose';
import { UserSchema } from '../src/repositories/msisdn/schema/user.schema';
import { MsisdnSchema } from '../src/repositories/msisdn/schema/msisdn.schema';
import { OrganisationSchema } from '../src/repositories/msisdn/schema/organisation.schema';

const testUser = [
  {
    personId: 'pass1',
    name: 'enrique',
    surname: 'bunbury',
    organisation: 'zaragoza',
    msisdn: '346900019',
  },
  {
    personId: 'pass2',
    name: 'pedro',
    surname: 'andreu',
    organisation: 'zaragoza',
    msisdn: '346900020',
  },
];

async function cleanDatabase() {
  const User = mongoose.model('User', UserSchema);
  const Msisdn = mongoose.model('Msisdn', MsisdnSchema);
  const Organisation = mongoose.model('Organisation', OrganisationSchema);

  await User.deleteMany({});
  await Organisation.deleteMany({});
  await Msisdn.updateMany({ user: { $ne: null } }, { $unset: { user: '' } });
}

describe('WebserverController (e2e) happy test', () => {
  let app: INestApplication;

  async function insertTestUsers() {
    const res0 = await request(app.getHttpServer())
      .post('/msisdn')
      .send(testUser[0]);
    expect(res0.status).toBe(200);
    const res1 = await request(app.getHttpServer())
      .post('/msisdn')
      .send(testUser[1]);
    expect(res1.status).toBe(200);
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const uri = 'mongodb://rogier:taal@localhost:27017/msisdnDB';
    await mongoose.connect(uri);
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await app.close();
    await cleanDatabase();
    await mongoose.disconnect();
  });

  it('Unallocated msisdns can be fetched', async () => {
    const res = await request(app.getHttpServer()).get('/msisdn/available');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('result');
    expect(res.body.result.length).toBe(20);
  });

  it('Users can be created', async () => {
    await insertTestUsers();

    const res = await request(app.getHttpServer()).get('/msisdn/available');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('result');
    expect(res.body.result.length).toBe(18);
  });

  it('Users can be fetched by Organisation', async () => {
    await insertTestUsers();

    const res = await request(app.getHttpServer())
      .get('/msisdn/organisation')
      .send({ organisation: 'zaragoza' });
    expect(res.body).toHaveProperty('result');
    expect(res.body.result.length).toBe(2);
    expect(res.body.result).toMatchObject(testUser);
  });

  it('Users can be deleted', async () => {
    await insertTestUsers();

    const res0 = await request(app.getHttpServer())
      .delete('/msisdn')
      .send({ personId: testUser[0].personId });
    expect(res0.status).toBe(200);
    const res1 = await request(app.getHttpServer())
      .delete('/msisdn')
      .send({ personId: testUser[1].personId });
    expect(res1.status).toBe(200);
  });
});
