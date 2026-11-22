
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),

    // 日期
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),

    // 图片
    heroImage: z.string().optional(),
    coverImage: z.string().optional(),
    coverImageAlt: z.string().optional(),

    // 内容分类
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),

    // SEO
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),

    // 作者与展示
    author: z.string().optional(),
    featured: z.boolean().default(false),

    // 发布状态
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };

