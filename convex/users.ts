import { CaretSortIcon } from "@radix-ui/react-icons";
import { MutationCtx, QueryCtx, internalMutation } from "./_generated/server";
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
    args: {tokenIdentifier: v.string()},
    async handler(ctx, args) {
        await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            orgIds: []
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
})