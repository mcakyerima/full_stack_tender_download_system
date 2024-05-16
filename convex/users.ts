import { CaretSortIcon } from "@radix-ui/react-icons";
import { MutationCtx, QueryCtx, internalMutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { roles } from "./schema";

// getUser helper function
export const getUser = async (ctx: QueryCtx | MutationCtx, tokenIdentifier: string) => {
    const user =  await ctx.db
    .query("users")
    .withIndex(
        "by_tokenIdentifier",
        q => q.eq("tokenIdentifier", tokenIdentifier)
    ).first()

    if (!user) throw new ConvexError("user should be defined");

    return user;

}

// method to create user recieved from webhook
export const createUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        name: v.string(),
        image: v.optional(v.string())
    },
    async handler(ctx, args) {
        await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            orgIds: [],
            name: args.name,
            image: args.image
        })
    }
}) 

// update user
export const updateUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        name: v.string(),
        image: v.optional(v.string())
    },
    async handler(ctx, args) {
        // get the user for updating
        const user = await ctx.db.query("users")
        .withIndex(
            "by_tokenIdentifier",
            q => q.eq("tokenIdentifier", args.tokenIdentifier)
        ).first();
        // throw convex error if no user
        if (!user) throw new ConvexError("No user with the given tokenIdentifier found.");

        await ctx.db.patch(user._id, {
            name: args.name,
            image: args.image
        })
    }
}) 

// method to add user recieved from webhook to an organization
export const addOrgIdToUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        orgId: v.string(),
        role: roles
    },
    async handler(ctx, args) {
        // get the user using tokenIdentifier
        const user = await getUser(ctx, args.tokenIdentifier)

        // patch the user and add orgId to their record
        await ctx.db.patch(user._id, {
            orgIds: [...user.orgIds, { orgId: args.orgId, role: args.role}]
        })
    }
});

// method to update user role in organization
export const updateRoleInOrgForUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        orgId: v.string(),
        role: roles
    },
    async handler(ctx, args) {
        console.log(args.role);
        // get the user using tokenIdentifier
        const user = await getUser(ctx, args.tokenIdentifier);

        // get the users org
        const org = user.orgIds.find(item => item.orgId === args.orgId);

        if (!org) throw new ConvexError("Expecting an org on the user, but found none when updating.");

        //update org role
        org.role = args.role

        // patch the user and add orgId to their record
        await ctx.db.patch(user._id, {
            orgIds: [org]
        })
    }
});

export const getUserProfile = query({
    args: {userId: v.id("users")},
    async handler(ctx, args) {
        const user = await ctx.db.get(args.userId);

        return {
            name: user?.name,
            image: user?.image
        }
    },
})