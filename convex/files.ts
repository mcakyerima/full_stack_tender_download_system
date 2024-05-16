// Mutaion allows you to create tables and add data to your database
// in realtime, it also has schema validation and uses websockets

import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, internalMutation, mutation, query } from "./_generated/server"
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
    if (!user) return null;

    const hasAccess = 
            user.orgIds.some(item => item.orgId === orgId) ||
            user.tokenIdentifier.includes(orgId);
 
    if (!hasAccess) return null;

    return { user }
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
        isPublic: v.optional(v.boolean())
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
            fileId: args.fileId,
            isPublic: args.isPublic,
            userId: hasAccess.user._id
        });
    }
})


// getFiles query is used to fetch data from database
export const getFiles = query({
    args:{
        orgId: v.string(),
        query: v.optional(v.string()),
        favorites: v.optional(v.boolean()),
        isPublic: v.optional(v.boolean()),
        deleteOnly: v.optional(v.boolean())
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
        let files = await ctx.db.query("files").withIndex("by_orgId_isPublic",
         q => q.eq("orgId", args.orgId)
        ).collect();

       
        // Getting favorite files
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

        if (args.isPublic) {
            files = await ctx.db.query("files").collect()
        }
        if (args.deleteOnly) {
            // filter files that are favorites
            files = files.filter( file => file.shouldDelete)
        } else {
            files = files.filter( file => !file.shouldDelete)
        }

         // if no query return files else do a javascript filter with query and reuturn
         const query = args.query

         if (query) {
             files = files.filter(file => file.name.toLowerCase().includes(query.toLowerCase()));
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
        const access = await hasAccessToOrg(
            ctx,
            identity.tokenIdentifier,
            file.orgId
        );

        // stop unauthorized access
        if (!access) throw new ConvexError("you do not have access to this organization");

        //check if role is admin
        if (access.user.orgIds.some(item => item.orgId === file.orgId && item.role === "admin")) {
            // delete file from database
            await ctx.db.patch(args.fileId, {
                shouldDelete: true,
            });
        } else {
            throw new ConvexError("you must be an admin to delete a file");
        }

    }
})

// Restore Files
export const restoreFile = mutation({
    args: {
        fileId: v.id("files")
    },
    async handler(ctx, args) {
        // stop unauthorized access
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) throw new ConvexError("you must be logged in to restore a file");

        // get file from database
        const file = await ctx.db.get(args.fileId);

        // if file does not exist throw a convex error
        if (!file) throw new ConvexError("file does not exist");

        // check if user has access to the org
        const access = await hasAccessToOrg(
            ctx,
            identity.tokenIdentifier,
            file.orgId
        );

        // stop unauthorized access
        if (!access) throw new ConvexError("you do not have access to this organization");

        //check if role is admin
        if (access.user.orgIds.some(item => item.orgId === file.orgId && item.role === "admin")) {
            // delete file from database
            await ctx.db.patch(args.fileId, {
                shouldDelete: false,
            });
        } else {
            throw new ConvexError("you must be an admin to restore a file");
        }

    }
});

// cron job internal mutation to delete all files
export const deleteAllFiles = internalMutation({
    args: {},
    async handler(ctx, args) {
        // fetch all fles with shouldDelete set to true
        const files = await ctx.db
                    .query("files")
                    .withIndex("by_shouldDelete", (q) => q.eq("shouldDelete", true))
                    .collect();
        // loop through files and delete them using promise.all
        await Promise.all(files.map(async (file) => {
            await ctx.storage.delete(file.fileId);
            return await ctx.db.delete(file._id);
        }
        ));
    }
});

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



// when favorite is selected, set favorite column to true for user
export const getAllFavorites = query({
    args: {
        orgId: v.string(),
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

        // get the user
         const user = await ctx.db.query("users").withIndex("by_tokenIdentifier",
        (q) => q.eq("tokenIdentifier", identity.tokenIdentifier)).first();

        if (!user) throw new ConvexError("user does not exist");

        // fetch favorite
        const favorites = await ctx.db.query("favorites")
            .withIndex("by_userId_fileId_orgId", (q) =>
            q.eq("userId", user._id).eq("orgId", args.orgId)).collect();

        return favorites
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