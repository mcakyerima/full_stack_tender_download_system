// Mutaion allows you to create tables and add data to your database
// in realtime, it also has schema validation and uses websockets

import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server"
import { getUser } from "./users";
import { fileTypes } from "./schema";

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
        type: fileTypes,
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
            type: args.type,
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
        orgId: v.string(),
        query: v.optional(v.string()),
        favorites: v.optional(v.boolean()),
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
        let files = await ctx.db.query("files").withIndex("by_orgId",
         q => q.eq("orgId", args.orgId)
        ).collect();

        // if no query return files else do a javascript filter with query and reuturn
        const query = args.query

        if (query) {
            files = files.filter(file => file.name.toLowerCase().includes(query.toLowerCase()));
        } 

        if (args.favorites) {
            // get the user
            const user = await ctx.db.query("users").withIndex("by_tokenIdentifier",
            (q) => q.eq("tokenIdentifier", identity.tokenIdentifier)).first();

            if (!user) return files;

            const favorites = await ctx.db.query(
                "favorites"
            ).withIndex("by_userId_fileId_orgId", (q) =>
            q.eq("userId", user?._id).eq("orgId", args.orgId)).collect();

            // filter files that are favorites
            files = files.filter( file => favorites.some(favorite => favorite.fileId === file._id))
        }


        return files

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

// generate an image url based on storage id
export const imageUrl = query({
    args: {
        fileId: v.id("_storage")
    },
    async handler(ctx, args) {
        // stop unauthorized access
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) throw new ConvexError("you must be logged in to delete a file");

        const url = await ctx.storage.getUrl(args.fileId);
        return url;
    }
});

// when favorite is selected, set favorite column to true for user
export const setFavorite = mutation({
    args: {
        fileId: v.id("files"),
    },
    async handler(ctx, args) {
        // stop unauthorized access
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError("No user found");
            return []
        }

        const file = await ctx.db.get(args.fileId);

        if (!file) throw new ConvexError("file does not exist");
        // check if user has access to the org
        const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, file.orgId);

        // return empty array if user does not have access
        if (!hasAccess) return [];

        // get the user
        const user = await ctx.db.query("users").withIndex("by_tokenIdentifier",
        (q) => q.eq("tokenIdentifier", identity.tokenIdentifier)).first();

        if (!user) throw new ConvexError("user does not exist");

        // fetch favorite
        const favorite = await ctx.db.query("favorites")
            .withIndex("by_userId_fileId_orgId", (q) =>
            q.eq("userId", user._id).eq("orgId", file.orgId).eq("fileId", args.fileId)).first();

        if (!favorite) {
            await ctx.db.insert("favorites", {
                fileId: args.fileId,
                orgId: file.orgId,
                userId: user._id
            });
        } else {
            await ctx.db.delete(favorite._id);
        }
    }
});

// async function hasAccessTofFile(
//     ctx: QueryCtx | MutationCtx,
//     fileId: Id<"files">
// ) {
//     // stop unauthorized access
//     const identity = await ctx.auth.getUserIdentity();

//     if (!identity) {
//         return null;
//     }

//     const file = await ctx.db.get(fileId);

//     if (!file) return null;
//     // check if user has access to the org
//     const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, fileId);

//     // return empty array if user does not have access
//     if (!hasAccess) return [];

//     // get the user
//     const user = await ctx.db.query("users").withIndex("by_tokenIdentifier",
//     (q) => q.eq("tokenIdentifier", identity.tokenIdentifier)).first();

//     if (!user) return null;

//     return { user,}

// }