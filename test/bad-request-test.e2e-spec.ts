import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from 'supertest';
import { AppModule } from '../src/app.module';
import * as mongoose from 'mongoose';
import { UserSchema } from '../src/repositories/msisdn/schema/user.schema';
import { MsisdnSchema } from '../src/repositories/msisdn/schema/msisdn.schema';
import { OrganisationSchema } from '../src/repositories/msisdn/schema/organisation.schema';

const user = {
  personId: 'pass1',
  name: 'enrique',
  surname: 'bunbury',
  organisation: 'zaragoza',
  msisdn: '346900019',
};

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

  it('POST /msisdn returns 400 when schema does not match', async () => {
    let missingName = { ...user }
    delete missingName.name
    let res = await request(app.getHttpServer()).post('/msisdn').send(missingName)
    expect(res.body.message).toEqual(['name should not be empty', 'name must be a string']);
    expect(res.status).toBe(400);

    let missingSurname = { ...user }
    delete missingSurname.surname
    res = await request(app.getHttpServer()).post('/msisdn').send(missingSurname);
    expect(res.body.message).toEqual(['surname should not be empty', 'surname must be a string']);
    expect(res.status).toBe(400);

    let missingMsisdn = { ...user }
    delete missingMsisdn.msisdn;
    res = await request(app.getHttpServer()).post('/msisdn').send(missingMsisdn);
    expect(res.body.message).toEqual(['msisdn should not be empty', 'msisdn must be a string']);
    expect(res.status).toBe(400);

    let missingOrganisation = { ...user }
    delete missingOrganisation.organisation;
    res = await request(app.getHttpServer()).post('/msisdn').send(missingOrganisation);
    expect(res.body.message).toEqual(['organisation should not be empty', 'organisation must be a string']);
    expect(res.status).toBe(400);

    let missingPersonId = { ...user }
    delete missingPersonId.personId;
    res = await request(app.getHttpServer()).post('/msisdn').send(missingPersonId);
    expect(res.body.message).toEqual(['personId should not be empty', 'personId must be a string']);
    expect(res.status).toBe(400);

    let nameShouldBeString = { ...user }
    // @ts-ignore
    nameShouldBeString.name = 99;
    res = await request(app.getHttpServer()).post('/msisdn').send(nameShouldBeString);
    expect(res.body.message).toEqual(['name must be a string']);
    expect(res.status).toBe(400);
  });
});
