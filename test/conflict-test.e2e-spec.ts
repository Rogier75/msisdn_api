import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from 'supertest';
import { AppModule } from '../src/app.module';
import * as mongoose from 'mongoose';
import { UserSchema } from '../src/repositories/msisdn/schema/user.schema';
import { MsisdnSchema } from '../src/repositories/msisdn/schema/msisdn.schema';
import { OrganisationSchema } from '../src/repositories/msisdn/schema/organisation.schema';

async function cleanDatabase() {
  const User = mongoose.model('User', UserSchema);
  const Msisdn = mongoose.model('Msisdn', MsisdnSchema);
  const Organisation = mongoose.model('Organisation', OrganisationSchema);

  await User.deleteMany({});
  await Organisation.deleteMany({});
  await Msisdn.updateMany({ user: { $ne: null } }, { $unset: { user: '' } });
}

describe('WebserverController (e2e) conflict test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
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

  it('Allocate different msisdn to existing user results in error', async () => {
    const user = {
      personId: 'pass1',
      name: 'enrique',
      surname: 'bunbury',
      organisation: 'zaragoza',
      msisdn: '346900019',
    };

    const res0 = await request(app.getHttpServer()).post('/msisdn').send(user);
    expect(res0.status).toBe(200);

    user.msisdn = '346900020';

    const res1 = await request(app.getHttpServer()).post('/msisdn').send(user);
    expect(res1.status).toBe(409);
    expect(res1.body.hasOwnProperty('errorCode'));
    expect(res1.body.errorCode).toBe('USER_ALREADY_HAS_DIFFERENT_MSISDN');
  });

  it('Allocate same msisdn to other user results in error', async () => {
    const user = {
      personId: 'pass1',
      name: 'enrique',
      surname: 'bunbury',
      organisation: 'zaragoza',
      msisdn: '346900019',
    };

    const res0 = await request(app.getHttpServer()).post('/msisdn').send(user);
    expect(res0.status).toBe(200);

    user.personId = 'pass2';
    user.name = 'pedro';
    user.surname = 'andreu';

    const res1 = await request(app.getHttpServer()).post('/msisdn').send(user);
    expect(res1.status).toBe(409);
    expect(res1.body.hasOwnProperty('errorCode'));
    expect(res1.body.errorCode).toBe('MSISDN_IN_USE_BY_OTHER_USER');
  });

  it('Allocate non existing msisdn results in error', async () => {
    const user = {
      personId: 'pass1',
      name: 'enrique',
      surname: 'bunbury',
      organisation: 'zaragoza',
      msisdn: '000000000',
    };

    const res = await request(app.getHttpServer()).post('/msisdn').send(user);
    expect(res.status).toBe(409);
    expect(res.body.hasOwnProperty('errorCode'));
    expect(res.body.errorCode).toBe('MSISDN_NOT_FOUND');
  });
});
