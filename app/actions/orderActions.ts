'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(orderId: number, status: string) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status,
        updatedAt: new Date()
      }
    });
    
    revalidatePath('/admin/orders');
    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}

export async function updateOrderNotes(orderId: number, notes: string) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        notes,
        updatedAt: new Date()
      }
    });
    
    revalidatePath('/admin/orders');
    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error('Error updating order notes:', error);
    return { success: false, error: 'Failed to update order notes' };
  }
}

export async function updateOrder(orderId: number, status: string, notes: string) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status,
        notes,
        updatedAt: new Date()
      }
    });
    
    revalidatePath('/admin/orders');
    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error('Error updating order:', error);
    return { success: false, error: 'Failed to update order' };
  }
}