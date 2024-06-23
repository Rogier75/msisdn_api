import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Msisdn } from './schema/msisdn.schema';
import { User } from './schema/user.schema';
import { Organisation } from './schema/organisation.schema';
import MsisdnInUseException from './exception/msisdn-in-use.exception';
import UserMsisdnAlreadyAllocatedException from './exception/user-msisdn-already-allocated.exception';
import MsisdnNotFoundException from './exception/msisdn-not-found.exception';
import { AllocateMsisdn } from './interface/allocate-msisdn';
import { DeAllocateMsisdn } from './interface/de-allocate-msisdn';

@Injectable()
export class MsisdnService {
  private readonly logger = new Logger(MsisdnService.name);

  constructor(
    @InjectModel(Msisdn.name) private msisdnModel: Model<Msisdn>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Organisation.name)
    private organisationModel: Model<Organisation>,
  ) {}

  async assignMsisdnToUser(allocateMsisdn: AllocateMsisdn) {
    const msisdnOid = await this.msisdnModel
      .findOne({ msisdn: allocateMsisdn.msisdn })
      .exec();

    if (!msisdnOid) {
      throw new MsisdnNotFoundException(allocateMsisdn.msisdn);
    }

    let userOid = await this.userModel
      .findOne({ personId: allocateMsisdn.personId })
      .exec();

    this.logger.log('found msisdn:', msisdnOid);
    this.logger.log('found user:', userOid);

    if (userOid) {
      if (userOid.msisdn._id.equals(msisdnOid._id)) {
        // Already exist with this user. No error
        return;
      } else {
        throw new UserMsisdnAlreadyAllocatedException(allocateMsisdn.personId);
      }
    } else if (msisdnOid.assigned) {
      throw new MsisdnInUseException(allocateMsisdn.msisdn);
    }

    let organisationOid = await this.organisationModel
      .findOne({
        name: allocateMsisdn.organisation,
      })
      .exec();
    this.logger.log('found organisation:', organisationOid);

    /////////////////////////
    // Create Organisation //
    /////////////////////////
    if (!organisationOid) {
      const createdOrganisation = new this.organisationModel({
        name: allocateMsisdn.organisation,
      });
      organisationOid = await createdOrganisation.save();
      this.logger.log('created organisation', organisationOid);
    }

    console.log('going to create user:', {
      personId: allocateMsisdn.personId,
      name: allocateMsisdn.name,
      surname: allocateMsisdn.surname,
      msisdn: msisdnOid,
      organisation: organisationOid,
    });

    /////////////////////////
    // Create User         //
    /////////////////////////
    const createdUser = new this.userModel({
      personId: allocateMsisdn.personId,
      name: allocateMsisdn.name,
      surname: allocateMsisdn.surname,
      msisdn: msisdnOid,
      organisation: organisationOid,
    });
    userOid = await createdUser.save();
    this.logger.log('created user', userOid);

    //////////////////////////
    // Update msisdn status //
    //////////////////////////
    msisdnOid.assigned = true;
    await msisdnOid.save();
  }

  async deAssignMsisdn(deAllocateMsisdn: DeAllocateMsisdn) {
    return;
  }

  async getAllAvailableMsisdns() {
    const models: Msisdn[] = await this.msisdnModel
      .find({ assigned: false })
      .exec();
    return models.map((model) => model.msisdn);
  }
  // async create(createMsisdnDto: CreateMsisdnDto): Promise<Msisdn> {
  //   const createdMsisdn = new this.MsisdnModel(createMsisdnDto);
  //   return createdMsisdn.save();
  // }
  //
  // async findAll(): Promise<Msisdn[]> {
  //   return this.MsisdnModel.find().exec();
  // }
}
