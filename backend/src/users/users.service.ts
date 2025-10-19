import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto, UpdateUserDto, SwitchRoleDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Handle backward compatibility: if role is provided, add it to roles array
    if (createUserDto.role && !createUserDto.roles) {
      createUserDto.roles = [createUserDto.role];
      createUserDto.activeRole = createUserDto.role;
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Handle backward compatibility: if role is provided, update roles array
    if (updateUserDto.role && !updateUserDto.roles) {
      const user = await this.findOne(id);
      const currentRoles = user.roles || [];
      if (!currentRoles.includes(updateUserDto.role)) {
        updateUserDto.roles = [...currentRoles, updateUserDto.role];
      }
      updateUserDto.activeRole = updateUserDto.role;
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async switchRole(id: string, switchRoleDto: SwitchRoleDto): Promise<User> {
    const user = await this.findOne(id);
    
    // Log for debugging
    console.log(`Switching role for user ${id}:`, {
      currentRoles: user.roles,
      currentActiveRole: user.activeRole,
      requestedRole: switchRoleDto.activeRole,
    });
    
    // Validate that the role exists in user's roles array
    if (!user.roles || !user.roles.includes(switchRoleDto.activeRole)) {
      console.error(`Role validation failed for user ${id}:`, {
        userRoles: user.roles,
        requestedRole: switchRoleDto.activeRole,
      });
      throw new BadRequestException(
        `Role '${switchRoleDto.activeRole}' is not assigned to this user. Available roles: ${user.roles?.join(', ') || 'none'}`
      );
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { activeRole: switchRoleDto.activeRole }, { new: true })
      .exec();
    
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    console.log(`Successfully switched role for user ${id} to ${switchRoleDto.activeRole}`);
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async count(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }
}
