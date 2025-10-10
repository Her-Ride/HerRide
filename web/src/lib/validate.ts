import { z } from "zod";
export const geocodeQuery = z.object({ address: z.string().min(1) });