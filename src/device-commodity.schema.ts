import { z } from "zod";

const commoditySchema = z
  .object({
    id: z.string(),
    createUser: z.string(),
    createDept: z.string(),
    createTime: z.string(),
    updateUser: z.string(),
    updateTime: z.string(),
    status: z.number(),
    isDeleted: z.number(),
    deviceId: z.string(),
    templateCommodityId: z.union([z.string(), z.number()]),
    categoriesId: z.string(),
    commodityCode: z.string(),
    commodityName: z.string(),
    commodityDesc: z.string(),
    commodityImg: z.string(),
    commodityPrice: z.string(),
    discountPrice: z.string(),
    coldOrHot: z.number(),
    sort: z.number(),
    isCharge: z.number(),
    isDiy: z.number(),
    coffeeLevel: z.number(),
    iceLevel: z.number(),
    coffeeVolume: z.number(),
    carbonatedVolume: z.number(),
    iceVolume: z.number(),
    secondIceVolume: z.number(),
    currencySymbols: z.string(),
    beansVolume: z.number(),
    doubleShot: z.number(),
    brewer: z.number(),
    tax: z.string(),
    taxPrice: z.string(),
    powderPressingForce: z.number(),
    extractionPressure: z.number(),
    extractionFlowRate: z.number(),
    wettingWaterVolume: z.number(),
    wettingWaterSpeed: z.number(),
    wettingWaterTime: z.number(),
    teaPowderPressingForce: z.number(),
    teaExtractionPressure: z.number(),
    teaExtractionFlowRate: z.number(),
    teaWettingWaterVolume: z.number(),
    otherCupCommodityId: z.string(),
    largeOrMedium: z.string(),
    nutritionImg: z.string(),
    displayNutrition: z.number(),
    sensitizationImg: z.string(),
    displaySensitization: z.number(),
    canisterOrder: z.number(),
    pumpOrder: z.number(),
    milkOrder: z.number(),
    coffeeOrder: z.number(),
    soldOut: z.number(),
    categoriesName: z.string(),
  })
  .strict();

export const deviceCommodityListResponseSchema = z
  .object({
    code: z.number(),
    success: z.boolean(),
    data: z
      .object({
        records: z.array(commoditySchema),
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

export type Commodity = z.infer<typeof commoditySchema>;
export type DeviceCommodityListResponse = z.infer<typeof deviceCommodityListResponseSchema>;
