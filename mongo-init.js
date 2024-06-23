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
      required: ['msisdn', 'assigned'],
      properties: {
        msisdn: {
          bsonType: 'string',
          description: "'msisdn' must be a string and is required",
        },
        assigned: {
          bsonType: 'bool',
          description: "'assigned' must be a boolean and is required",
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
      required: ['personId', 'name', 'surname', 'organisation', 'msisdn'],
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
        msisdn: {
          bsonType: 'objectId',
          description: "'msisdn' must be an objectId reference and is required",
        },
      },
    },
  },
});

db.msisdns.insertMany([
  { msisdn: '346900001', assigned: false },
  { msisdn: '346900002', assigned: false },
  { msisdn: '346900003', assigned: false },
  { msisdn: '346900004', assigned: false },
  { msisdn: '346900005', assigned: false },
  { msisdn: '346900006', assigned: false },
  { msisdn: '346900007', assigned: false },
  { msisdn: '346900008', assigned: false },
  { msisdn: '346900009', assigned: false },
  { msisdn: '346900010', assigned: false },
  { msisdn: '346900011', assigned: false },
  { msisdn: '346900012', assigned: false },
  { msisdn: '346900013', assigned: false },
  { msisdn: '346900014', assigned: false },
  { msisdn: '346900015', assigned: false },
  { msisdn: '346900016', assigned: false },
  { msisdn: '346900017', assigned: false },
  { msisdn: '346900018', assigned: false },
  { msisdn: '346900019', assigned: false },
  { msisdn: '346900020', assigned: false },
]);
