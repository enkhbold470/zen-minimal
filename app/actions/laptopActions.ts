'use server';

import { put } from '@vercel/blob';
import { revalidatePath, revalidateTag } from 'next/cache';

import { prisma } from '@/lib/prisma';
import { cacheStrategies } from '@/lib/cache-strategies';
import { CreateLaptopState } from '@/types/productTypes';
import { LaptopSchema } from './laptopTypes';

export async function createLaptop(prevState: CreateLaptopState, formData: FormData): Promise<CreateLaptopState> {
  const validatedFields = LaptopSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    specs: formData.get('specs'),
    price: formData.get('price'),
    originalPrice: formData.get('originalPrice'),
    discount: formData.get('discount'),
    videoUrl: formData.get('videoUrl'),
    images: formData.getAll('images'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the fields.',
      success: false,
    };
  }

  const { images, ...laptopData } = validatedFields.data;

  try {
    // First create the laptop without images
    const newLaptop = await prisma.laptop.create({
      data: laptopData,
    });

    // Upload each image and create Image records
    const imagePromises = images.map(async (image: File, index: number) => {
      const blob = await put(`laptops/${newLaptop.id}/${image.name}`, image, {
        access: 'public',
        contentType: image.type,
      });

      // Create the image record with position based on index
      return prisma.image.create({
        data: {
          url: blob.url,
          alt: `${laptopData.title} - Image ${index + 1}`,
          position: index,
          laptopId: newLaptop.id,
        },
      });
    });

    await Promise.all(imagePromises);

    revalidateTag('admin-laptops');
    revalidateTag('published-laptops');

    return { message: 'Laptop added successfully!', success: true };
  } catch (error) {
    console.error('Database error:', error);
    return {
      message: 'Failed to save laptop to database.',
      success: false,
      errors: { database: ['An unexpected error occurred. Please try again.'] },
    };
  }
}

// Add a new schema and action for updating laptops
export async function updateLaptop(id: number, formData: FormData): Promise<CreateLaptopState> {
  // Extract fields from formData
  const laptopData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    specs: (formData.get('specs') as string).split(',').map(s => s.trim()).filter(s => s.length > 0),
    price: parseFloat(formData.get('price') as string),
    originalPrice: parseFloat(formData.get('originalPrice') as string),
    discount: formData.get('discount') as string || null,
    videoUrl: formData.get('videoUrl') as string || null,
  };

  try {
    // Update the laptop data
    await prisma.laptop.update({
      where: { id },
      data: laptopData,
    });

    // Handle new images if any were uploaded
    const images = formData.getAll('newImages') as File[];
    if (images.length > 0 && images[0].size > 0) {
      // Get current highest position
      const lastImage = await prisma.image.findFirst({
        where: { laptopId: id },
        orderBy: { position: 'desc' },
      });
      
      const startPosition = lastImage ? lastImage.position + 1 : 0;
      
      // Upload each new image
      const imagePromises = images.map(async (image: File, index: number) => {
        if (image.size === 0) return null; // Skip empty files
        
        const blob = await put(`laptops/${id}/${Date.now()}-${image.name}`, image, {
          access: 'public',
          contentType: image.type,
        });

        // Create the image record
        return prisma.image.create({
          data: {
            url: blob.url,
            alt: `${laptopData.title} - Image ${startPosition + index + 1}`,
            position: startPosition + index,
            laptopId: id,
          },
        });
      });

      await Promise.all(imagePromises.filter(Boolean));
    }

    revalidateTag('admin-laptops');
    revalidateTag('published-laptops');

    return { 
      message: 'Laptop updated successfully!', 
      success: true 
    };
  } catch (error) {
    console.error('Error updating laptop:', error);
    return {
      message: 'Failed to update laptop.',
      success: false,
      errors: { database: ['An unexpected error occurred. Please try again.'] },
    };
  }
}

// GET all laptops for admin (with images) - Using Prisma Accelerate caching
export async function getAdminLaptops() {
  try {
    return await prisma.laptop.findMany({
      orderBy: { id: 'desc' },
      include: { images: { orderBy: { position: 'asc' } } },
      cacheStrategy: cacheStrategies.adminListing,
    });
  } catch (error) {
    console.error('Error getting laptops:', error);
    throw new Error('Failed to fetch laptops');
  }
}

// GET only published laptops for public pages (with images) - Aggressive caching for public data
export async function getPublishedLaptops() {
  try {
    return await prisma.laptop.findMany({
      where: { published: true },
      orderBy: { datePublished: 'desc' },
      include: { images: { orderBy: { position: 'asc' } } },
      cacheStrategy: cacheStrategies.public,
    });
  } catch (error) {
    console.error('Error getting published laptops:', error);
    throw new Error('Failed to fetch published laptops');
  }
}

// GET single laptop with caching - for individual laptop pages
export async function getLaptopById(id: number) {
  try {
    return await prisma.laptop.findUnique({
      where: { id },
      include: { images: { orderBy: { position: 'asc' } } },
      cacheStrategy: cacheStrategies.individualItem,
    });
  } catch (error) {
    console.error('Error getting laptop by ID:', error);
    throw new Error('Failed to fetch laptop');
  }
}

// GET laptop stats for dashboard - short cache for admin data
export async function getLaptopStats() {
  try {
    const [totalLaptops, publishedLaptops, totalImages] = await Promise.all([
      prisma.laptop.count({
        cacheStrategy: cacheStrategies.admin
      }),
      prisma.laptop.count({
        where: { published: true },
        cacheStrategy: cacheStrategies.admin
      }),
      prisma.image.count({
        cacheStrategy: cacheStrategies.admin
      })
    ]);

    return {
      totalLaptops,
      publishedLaptops,
      unpublishedLaptops: totalLaptops - publishedLaptops,
      totalImages,
    };
  } catch (error) {
    console.error('Error getting laptop stats:', error);
    throw new Error('Failed to fetch laptop statistics');
  }
}

// DELETE laptop
export async function deleteLaptop(id: number) {
  try {
    // Prisma will automatically delete related images due to the "onDelete: Cascade" relation
    await prisma.laptop.delete({
      where: { id },
    });
    
    revalidateTag('admin-laptops');
    revalidateTag('published-laptops');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting laptop:', error);
    return { success: false, error: 'Failed to delete laptop' };
  }
}

// UPDATE image positions
export async function updateImagePositions(imageUpdates: { id: number, position: number }[]) {
  try {
    // Create a transaction to update all images at once
    const updates = imageUpdates.map(({ id, position }) => 
      prisma.image.update({
        where: { id },
        data: { position },
      })
    );
    
    await prisma.$transaction(updates);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating image positions:', error);
    return { success: false, error: 'Failed to update image positions' };
  }
}

// DELETE image
export async function deleteImage(id: number) {
  try {
    await prisma.image.delete({
      where: { id },
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { success: false, error: 'Failed to delete image' };
  }
}

// TOGGLE publish status
export async function toggleLaptopPublishedStatus(id: number, currentStatus: boolean) {
  try {
    await prisma.laptop.update({
      where: { id },
      data: { published: !currentStatus },
    });
    revalidateTag('admin-laptops');
    revalidateTag('published-laptops');
    return { success: true, newState: !currentStatus };
  } catch (error) {
    console.error('Error toggling laptop published status:', error);
    return { success: false, error: 'Failed to update published status' };
  }
} 