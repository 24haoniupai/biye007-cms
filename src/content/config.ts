
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
    // 基础信息
    title: z.string(),
    pageTitle: z.string().optional(),
    wechat: z.string().optional(),
    email: z.string().optional(),

    // 首页图片
    coverImage: z.string().optional(),
    coverImageAlt: z.string().optional(),

    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),

    serviceImage1: z.string().optional(),
    serviceImage1Alt: z.string().optional(),

    serviceImage2: z.string().optional(),
    serviceImage2Alt: z.string().optional(),

    serviceImage3: z.string().optional(),
    serviceImage3Alt: z.string().optional(),

    qrImage: z.string().optional(),
    qrImageAlt: z.string().optional(),
    qrImageDescription: z.string().optional(),

    // 图片显示顺序
    imageOrder: z.string().optional(),

    // 首页模块显示开关
    showContact: z.boolean().default(true),
    showCoverImage: z.boolean().default(true),
    showHeroImage: z.boolean().default(true),
    showServiceImage1: z.boolean().default(true),
    showServiceImage2: z.boolean().default(true),
    showServiceImage3: z.boolean().default(true),
    showPostList: z.boolean().default(true),
    showQrImage: z.boolean().default(true),
    showBody: z.boolean().default(true),

    // 文章列表
    sectionHeading: z.string().optional(),
  }),
});

export const collections = { posts, pages };

