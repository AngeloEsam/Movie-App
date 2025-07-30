import { Request, Response } from 'express';
import prisma from '../db/prisma';
import { mediaSchema } from '../validation/media.validation';
const partialMediaSchema = mediaSchema.partial();
export const createMedia = async (req: Request, res: Response) => {
  try {
    const data = mediaSchema.parse(req.body);
    const media = await prisma.media.create({ data });
    res.status(201).json(media);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllMedia = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 30;
  const skip = (page - 1) * limit;

  const totalCount = await prisma.media.count();
  const media = await prisma.media.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' }
  });

  res.json({
    media,
    hasMore: skip + media.length < totalCount
  });
};

export const updateMedia = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const data = partialMediaSchema.parse(req.body);
    const updated = await prisma.media.update({
      where: { id },
      data,
    });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteMedia = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.media.delete({ where: { id } });
    res.json({ message: "Media deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
