import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Msisdn } from './schemas/msisdn.schema';
import { User } from './schemas/user.schema';
import { Organisation } from './schemas/organisation.schema';
//import { CreateMsisdnDto } from './dto/create-msisdn.dto';

@Injectable()
export class MsisdnService {
  constructor(
    @InjectModel(Msisdn.name) private msisdnModel: Model<Msisdn>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Organisation.name)
    private organisationModel: Model<Organisation>,
  ) {}

  async assignMsisdnToUser(msisdn: string, user: string, organisation: string) {
  }

  async deAssignMsisdn(msisdn: string) {}

  async getAllUnAssignedMsisdns() {
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
