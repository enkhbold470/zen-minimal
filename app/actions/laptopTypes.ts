import { z } from 'zod';

export const LaptopSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
  specs: z.string().transform(val => val.split(',').map(s => s.trim()).filter(s => s.length > 0)),
  price: z.coerce.number().positive({ message: 'Price must be a positive number' }),
  originalPrice: z.coerce.number().positive({ message: 'Original price must be a positive number' }),
  discount: z.string().optional(),
  videoUrl: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  images: z.preprocess(
    (arg) => {
      // If formData.getAll('images') is used, arg is File[].
      // If formData.get('images') is used and only one file, arg is File.
      // If no files, arg might be undefined.
      if (arg === undefined) return [];
      return Array.isArray(arg) ? arg : [arg];
    },
    z.array(
      z.custom<File>(
        (val): val is File =>
          typeof val === 'object' &&
          val !== null &&
          typeof (val as File).name === 'string' &&
          typeof (val as File).size === 'number' &&
          typeof (val as File).type === 'string',
        "Input is not a valid File object"
      )
    )
  )
  .refine(files => files.length > 0, 'At least one image is required.')
  .refine(files => files.every(file => file.size < 4 * 1024 * 1024), 'Each image must be less than 4MB.')
});

