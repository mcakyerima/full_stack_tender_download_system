import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
// define filetypes
export const fileTypes = v.union(
  v.literal("image"),
  v.literal("csv"), 
  v.literal("pdf"), 
  v.literal("doc"), 
  v.literal("xls")
);

export default defineSchema({
  files: defineTable({ 
    name: v.string(),
    type: fileTypes ,
    description: v.string(),
    deadline: v.string(),
    orgId: v.string(),
    fileId: v.id("_storage"),
  }).index("by_orgId", ["orgId"]),
  users: defineTable({
    tokenIdentifier: v.string(),
    orgIds: v.array(v.string())
  }).index("by_tokenIdentifier", ["tokenIdentifier"])
}); 

