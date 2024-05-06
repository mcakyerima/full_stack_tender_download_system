// Mutaion allows you to create tables and add data to your database
// in realtime, it also has schema validation and uses websockets

import { v } from "convex/values";
import { mutation, query } from "./_generated/server"

export const createFile = mutation({
    args: {
        name: v.string(),
    },
    async handler(ctx, args) {
        await ctx.db.insert("files", {
            name: args.name
        });
    }
})

// query is used to fetch data from database
export const getFiles = query({
    args:{},
    async handler(ctx, args) {
        return ctx.db.query('files').collect();
    }
})