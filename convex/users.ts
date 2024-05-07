import { CaretSortIcon } from "@radix-ui/react-icons";
import { MutationCtx, QueryCtx, internalMutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";

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

export const createUser = internalMutation({
    args: {tokenIdentifier: v.string()},
    async handler(ctx, args) {
        await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            orgIds: []
        })
    }
})

export const addOrgIdToUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        orgId: v.string()
    },
    async handler(ctx, args) {
        // get the user using tokenIdentifier
        const user = await getUser(ctx, args.tokenIdentifier)

        // patch the user and add orgId to their record
        await ctx.db.patch(user._id, {
            orgIds: [...user.orgIds, args.orgId]
        })
    }
})