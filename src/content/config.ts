
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

// 首页等独立页面
const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pageTitle: z.string().optional(),
    wechat: z.string().optional(),
    email: z.string().optional(),
    coverImage: z.string().optional(),
    heroImage: z.string().optional(),
    serviceImage1: z.string().optional(),
    serviceImage2: z.string().optional(),
    serviceImage3: z.string().optional(),
    sectionHeading: z.string().optional(),
    qrImage: z.string().optional(),
  }),
});
export const collections = { posts, pages };
