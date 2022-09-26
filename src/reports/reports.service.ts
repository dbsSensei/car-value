import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async create(reportDto: CreateReportDto, user: User) {
    const report = await this.repo.create(reportDto);
    report.user = user;
    return await this.repo.save(report);
  }

  async findOne(id: number) {
    const report = await this.repo.findOne({ id });
    if (!id || !report) {
      throw new NotFoundException('report not found');
    }
    return report;
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.findOne(id);

    Object.assign(report, { approved });
    return await this.repo.save(report);
  }

  async createEstimate({
    make,
    model,
    lng,
    lat,
    year,
    mileage,
  }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('approved IS TRUE')
      .andWhere('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }

  //
  // async find(email: string) {
  //   return await this.repo.find({ where: { email } });
  // }
  //
  // async update(id: number, attrs: Partial<Report>) {
  //   const report = await this.findOne(id);
  //   if (!report) {
  //     throw new NotFoundException();
  //   }
  //
  //   Object.assign(report, attrs);
  //   return await this.repo.save(report);
  // }
  //
  // async remove(id: number) {
  //   const report = await this.findOne(id);
  //   if (!report) {
  //     throw new NotFoundException();
  //   }
  //   return await this.repo.remove(report);
  // }
}
