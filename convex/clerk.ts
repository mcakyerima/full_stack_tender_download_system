import { WebhookEvent } from "@clerk/clerk-sdk-node"
import { v } from 'convex/values';
import { Webhook } from 'svix';

// internal actions are actions that are only accessible by other convex action, but not the client
import { internalAction } from './_generated/server';

const webhookSecreet = process.env.CLERK_WEBHOOK_SECRET || ``;

export const fulfill = internalAction({
    args: {
        headers: v.any(),
        payload: v.string(),
    },
    handler: async (ctx, args) => {
        const wh = new Webhook(webhookSecreet);
        const payload = wh.verify(
            args.payload,
            args.headers
        ) as WebhookEvent;
        return payload;
    },
});