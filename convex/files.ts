// Mutaion allows you to create tables and add data to your database
// in realtime, it also has schema validation and uses websockets

import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server"
import { getUser } from "./users";

// creating an upload url generator
export const generateUploadUrl = mutation(async (ctx) => {
    // stop unauthorized upload
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) throw new ConvexError("you must be logged in to upload a file");

    return await ctx.storage.generateUploadUrl();
});

// Helper function to check Org Access
async function hasAccessToOrg (
    ctx: QueryCtx | MutationCtx,
    tokenIdentifier: string,
    orgId: string
) {
    const user = await getUser(ctx, tokenIdentifier);
    const hasAccess = 
            user.orgIds.includes(orgId) ||
            user.tokenIdentifier.includes(orgId);

    return hasAccess
}

export const createFile = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        deadline: v.string(),
        orgId: v.string(),
        fileId: v.id("_storage"),
    },

    async handler(ctx, args) {
        // stop unauthorized upload
        const identity = await ctx.auth.getUserIdentity();
    
        if (!identity) throw new ConvexError("you must be logged in to upload a file");

        const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId);

        if (!hasAccess) throw new ConvexError("you do not have access to this org");

        await ctx.db.insert("files", {
            name: args.name,
            description: args.description,
            deadline: args.deadline,
            orgId: args.orgId,
            fileId: args.fileId
        });
    }
})

// query is used to fetch data from database
export const getFiles = query({
    args:{
        orgId: v.string()
    },
    async handler(ctx, args) {
        // stop unauthorized access
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            return []
        }
        const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId);

        if (!hasAccess) return [];

        // return ctx.db.)query('files').collect();
        return ctx.db.query("files").withIndex("by_orgId",
         q => q.eq("orgId", args.orgId)
        ).collect();
    }
})