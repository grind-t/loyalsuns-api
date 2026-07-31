import { z } from "zod";

const channelSchema = z
  .object({
    id: z.string(),
    createUser: z.string(),
    createDept: z.string(),
    createTime: z.string(),
    updateUser: z.string(),
    updateTime: z.string(),
    status: z.number(),
    isDeleted: z.number(),
    templateChannelId: z.string(),
    deviceId: z.string(),
    channelName: z.string(),
    channelType: z.number(),
    channelIndex: z.number(),
    channelRemark: z.string(),
    channelColor: z.string(),
    channelCalibrationValue: z.string(),
    channelCalibrationValueTwo: z.string(),
    channelWarnRatio: z.string(),
    channelStopRatio: z.string(),
    channelTotalVolume: z.number(),
    channelLeftVolume: z.number(),
    channelCalibrationValueUnit: z.number(),
    channelTotalVolumeUnit: z.number(),
    diyLevel: z.number(),
    isDiy: z.number(),
    overTemperatureStop: z.number(),
    isImmediatelyStopSell: z.number(),
    jzz: z.string(),
    total: z.string(),
    deviceCode: z.string(),
    margin: z.string(),
    isLack: z.number(),
    ratio: z.string(),
    inventoryId: z.number(),
    channelUnit: z.string(),
    channelCalibrationUnit: z.string(),
  })
  .strict();

export const deviceChannelListResponseSchema = z
  .object({
    code: z.number(),
    success: z.boolean(),
    data: z
      .object({
        records: z.array(channelSchema),
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

export type Channel = z.infer<typeof channelSchema>;
export type DeviceChannelListResponse = z.infer<typeof deviceChannelListResponseSchema>;
