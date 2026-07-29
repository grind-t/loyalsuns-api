import { z } from "zod";

const formulaDetailSchema = z
  .object({
    id: z.string(),
    createUser: z.string(),
    createDept: z.string(),
    createTime: z.string(),
    updateUser: z.string(),
    updateTime: z.string(),
    status: z.number(),
    isDeleted: z.number(),
    deviceTemplateId: z.union([z.string(), z.number()]),
    channelId: z.string(),
    diyLevel: z.string(),
    diyImage: z.string(),
    shipments: z.string(),
    waterAmount: z.string(),
    waterType: z.number(),
    shipmentType: z.number(),
    templateCommodityId: z.union([z.string(), z.number()]),
    shipmentOrder: z.number(),
    shipmentsG: z.union([z.string(), z.number()]),
    waterAmountMl: z.union([z.string(), z.number()]),
    channelName: z.string(),
    ingredients: z.string(),
    waterAndUnit: z.string(),
    shipmentsAndUnit: z.string(),
    channelType: z.number(),
    channelIndex: z.number(),
  })
  .strict();

export const deviceFormulaDetailListResponseSchema = z
  .object({
    code: z.number(),
    success: z.boolean(),
    data: z
      .object({
        records: z.array(formulaDetailSchema),
        total: z.number(),
        size: z.number(),
        current: z.number(),
        orders: z.array(z.unknown()),
        optimizeCountSql: z.boolean(),
        searchCount: z.boolean(),
        countId: z.string(),
        maxLimit: z.number(),
        pages: z.number(),
      })
      .strict(),
    msg: z.string(),
  })
  .strict();

export type DeviceFormulaDetailListResponse = z.infer<typeof deviceFormulaDetailListResponseSchema>;
