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

// createFile is used to create a file in the database
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
        
        // stop unauthorized upload
        if (!identity) throw new ConvexError("you must be logged in to upload a file");

        // check if user has access to the org
        const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId);

        // stop unauthorized access
        if (!hasAccess) throw new ConvexError("you do not have access to this org");

        // add file to database
        await ctx.db.insert("files", {
            name: args.name,
            description: args.description,
            deadline: args.deadline,
            orgId: args.orgId,
            fileId: args.fileId
        });
    }
})

// getFiles query is used to fetch data from database
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
        // check if user has access to the org
        const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId);

        // return empty array if user does not have access
        if (!hasAccess) return [];

        // return ctx.db.)query('files').collect();
        return ctx.db.query("files").withIndex("by_orgId",
         q => q.eq("orgId", args.orgId)
        ).collect();
    }
})

// deleteFile mutation is used to delete a file from the database
export const deleteFile = mutation({
    args: {
        fileId: v.id("files")
    },
    async handler(ctx, args) {
        // stop unauthorized access
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) throw new ConvexError("you must be logged in to delete a file");

        // get file from database
        const file = await ctx.db.get(args.fileId);

        // if file does not exist throw a convex error
        if (!file) throw new ConvexError("file does not exist");

        // check if user has access to the org
        const hasAccess = await hasAccessToOrg(
            ctx,
            identity.tokenIdentifier,
            file.orgId
        );

        // stop unauthorized access
        if (!hasAccess) throw new ConvexError("you do not have access to this org");

        // if user has no access to the org, throw a convex error
        if (!hasAccess) throw new ConvexError("you do not have access to delete this file");

        // delete file from database
        await ctx.db.delete(args.fileId);
    }
})