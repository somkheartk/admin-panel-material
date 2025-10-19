import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop({ type: [String], default: ['user'] })
  roles: string[];

  @Prop({ default: 'user' })
  activeRole: string;

  // Keep for backward compatibility
  @Prop()
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
