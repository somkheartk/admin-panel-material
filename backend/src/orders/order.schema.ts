import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true })
  orderNumber: string;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  product: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'pending' })
  status: string;

  @Prop()
  description: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
