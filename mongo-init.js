db.getSiblingDB('admin').auth(
  process.env.MONGO_INITDB_ROOT_USERNAME,
  process.env.MONGO_INITDB_ROOT_PASSWORD,
);

db.createUser({
  user: process.env.MONGO_USER,
  pwd: process.env.MONGO_PASSWORD,
  roles: [{ role: 'readWrite', db: 'msisdnDB' }],
});

db.createCollection('msisdns', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      title: 'Msisdn Object Validation',
      required: ['msisdn'],
      properties: {
        msisdn: {
          bsonType: 'string',
          description: "'msisdn' must be a string and is required",
        },
        user: {
          bsonType: 'objectId',
          description: "'user' must be an objectId reference",
        },
      },
    },
  },
});

db.createCollection('organisations', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      title: 'Organisation Object Validation',
      required: ['name'],
      properties: {
        userid: {
          bsonType: 'string',
          description: "'name' must be a string and is required",
        },
      },
    },
  },
});

db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      title: 'User Object Validation',
      required: ['personId', 'name', 'surname', 'organisation'],
      properties: {
        personId: {
          bsonType: 'string',
          description: "'name' must be a string and is required",
        },
        name: {
          bsonType: 'string',
          description: "'name' must be a string and is required",
        },
        surname: {
          bsonType: 'string',
          description: "'surname' must be a string and is required",
        },
        organisation: {
          bsonType: 'objectId',
          description:
            "'organisation' must be an objectId reference and is required",
        },
      },
    },
  },
});

db.msisdns.insertMany([
  { msisdn: '346900001' },
  { msisdn: '346900002' },
  { msisdn: '346900003' },
  { msisdn: '346900004' },
  { msisdn: '346900005' },
  { msisdn: '346900006' },
  { msisdn: '346900007' },
  { msisdn: '346900008' },
  { msisdn: '346900009' },
  { msisdn: '346900010' },
  { msisdn: '346900011' },
  { msisdn: '346900012' },
  { msisdn: '346900013' },
  { msisdn: '346900014' },
  { msisdn: '346900015' },
  { msisdn: '346900016' },
  { msisdn: '346900017' },
  { msisdn: '346900018' },
  { msisdn: '346900019' },
  { msisdn: '346900020' },
]);
