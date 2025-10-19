import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get()
  async check() {
    const dbState = this.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : 'disconnected';

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        state: dbState,
      },
      features: {
        roleSwitch: true,
        multiRoleSupport: true,
      },
    };
  }

  @Get('roles')
  async checkRoles() {
    const User = this.connection.model('User');
    const users = await User.find({}).select('email roles activeRole').exec();

    const stats = {
      totalUsers: users.length,
      usersWithMultipleRoles: users.filter((u: any) => u.roles && u.roles.length > 1).length,
      usersWithSingleRole: users.filter((u: any) => u.roles && u.roles.length === 1).length,
      usersWithInvalidConfig: users.filter((u: any) => !u.roles || !u.activeRole || !u.roles.includes(u.activeRole)).length,
      users: users.map((u: any) => ({
        email: u.email,
        roles: u.roles,
        activeRole: u.activeRole,
        canSwitchRoles: u.roles && u.roles.length > 1,
        isValid: u.roles && u.activeRole && u.roles.includes(u.activeRole),
      })),
    };

    return stats;
  }
}
