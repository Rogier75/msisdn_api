import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Msisdn } from './schema/msisdn.schema';
import { User } from './schema/user.schema';
import { Organisation } from './schema/organisation.schema';
import MsisdnInUseException from './exception/msisdn-in-use.exception';
import UserMsisdnAlreadyAllocatedException from './exception/user-msisdn-already-allocated.exception';
import MsisdnNotFoundException from './exception/msisdn-not-found.exception';
import { UserDto } from './dto/user.dto';

@Injectable()
export class MsisdnService {
  private readonly logger = new Logger(MsisdnService.name);

  constructor(
    @InjectModel(Msisdn.name) private msisdnModel: Model<Msisdn>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Organisation.name)
    private organisationModel: Model<Organisation>,
  ) {}

  async allocateMsisdn(model: UserDto): Promise<void> {
    const msisdnOid = await this.msisdnModel
      .findOne({ msisdn: model.msisdn })
      .exec();

    this.logger.debug('found msisdn:', msisdnOid);

    if (!msisdnOid) {
      throw new MsisdnNotFoundException(model.msisdn);
    }

    let userOid = await this.userModel
      .findOne({ personId: model.personId })
      .exec();

    this.logger.debug('found user:', userOid);

    if (userOid) {
      if (msisdnOid.user?._id.equals(userOid._id)) {
        // Already exist with this user. No error
        return;
      } else {
        throw new UserMsisdnAlreadyAllocatedException(model.personId);
      }
    } else if (msisdnOid.user) {
      throw new MsisdnInUseException(model.msisdn);
    }

    let organisationOid = await this.organisationModel
      .findOne({
        name: model.organisation,
      })
      .exec();
    this.logger.debug('found organisation:', organisationOid);

    /////////////////////////
    // Create Organisation //
    /////////////////////////
    if (!organisationOid) {
      const createdOrganisation = new this.organisationModel({
        name: model.organisation,
      });
      organisationOid = await createdOrganisation.save();
      this.logger.log('created organisation', organisationOid);
    }

    this.logger.debug('going to create user:', {
      personId: model.personId,
      name: model.name,
      surname: model.surname,
      msisdn: msisdnOid,
      organisation: organisationOid,
    });

    /////////////////////////
    // Create User         //
    /////////////////////////
    const createdUser = new this.userModel({
      personId: model.personId,
      name: model.name,
      surname: model.surname,
      organisation: organisationOid,
    });
    userOid = await createdUser.save();
    this.logger.debug('created user:', userOid);

    /////////////////////////
    // Update msisdn user  //
    /////////////////////////
    await msisdnOid.updateOne({ $set: { user: userOid } });
  }

  async deAllocateMsisdn(personId: string): Promise<void> {
    const userOid = await this.userModel.findOne({ personId: personId }).exec();

    this.logger.debug('found user:', userOid);

    if (!userOid) {
      // Already gone. No error
      return;
    }

    const msisdnOid = await this.msisdnModel.findOne({ user: userOid }).exec();

    this.logger.debug('found msisdn:', msisdnOid);

    /////////////////////////
    // Remove from msisdn  //
    /////////////////////////
    if (msisdnOid) {
      await msisdnOid.updateOne({ $unset: { user: '' } });
    }

    /////////////////////////
    // Delete user object  //
    /////////////////////////
    await userOid.deleteOne();

    //TODO maybe delete the organisation object if no more users
  }

  async getOrganisationMsisdns(organisationId: string): Promise<UserDto[]> {
    const organisationOid = await this.organisationModel
      .findOne({ name: organisationId })
      .exec();
    this.logger.debug('found organisation:', organisationOid);
    if (!organisationOid) {
      return [];
    }

    const userOids = await this.userModel
      .find({ organisation: organisationOid })
      .exec();
    this.logger.debug('found userOids:', userOids);
    if (!userOids.length) {
      return [];
    }

    const msisdnOids = await this.msisdnModel.find({ user: { $in: userOids } });

    /////////////////////////
    // Map user msisdn     //
    /////////////////////////
    return msisdnOids
      .map(function (model) {
        const user = userOids.find((userOid) =>
          userOid._id.equals(model.user._id),
        );
        return {
          personId: user.personId,
          name: user.name,
          surname: user.surname,
          msisdn: model.msisdn,
          organisation: organisationOid.name,
        };
        //sort them to always get a consistent response
      })
      .sort((a, b) => a.msisdn.localeCompare(b.msisdn));
  }

  async getAllAvailableMsisdns(): Promise<string[]> {
    const msisdnOids: Msisdn[] = await this.msisdnModel
      .find({ user: { $exists: false } })
      .exec();
    this.logger.debug('found msisdnOids:', msisdnOids);
    //sort them to always get a consistent response
    return msisdnOids.map((model) => model.msisdn).sort();
  }
}
