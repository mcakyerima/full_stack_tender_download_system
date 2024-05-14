import { httpRouter } from 'convex/server';
import { internal } from './_generated/api';
import { httpAction } from './_generated/server';

const http = httpRouter();

const clerkDomain = process.env.CLERK_DOMAIN;

http.route({
    path: '/clerk',
    method: 'POST',
    handler: httpAction(async (ctx, request) => {
        const payloadString = await request.text();
        const headerPayload = request.headers;
        try {
            const result = await ctx.runAction(internal.clerk.fulfill, {
                payload: payloadString,
                headers: {
                    'svix-id': headerPayload.get('svix-id')!,
                    'svix-timestamp': headerPayload.get('svix-timestamp')!,
                    'svix-signature': headerPayload.get('svix-signature')!,
                },
            });

            switch (result.type) {
                case 'user.created':
                    await ctx.runMutation(internal.users.createUser, {
                        tokenIdentifier: `${clerkDomain}|${result.data.id}`,
                    });
                    break;
                case 'organizationMembership.created':
                    console.log({ OrgIdentifier: result.data.public_user_data });
                    await ctx.runMutation(internal.users.addOrgIdToUser, {
                        tokenIdentifier: `${clerkDomain}|${result.data.public_user_data.user_id}`,
                        orgId: result.data.organization.id,
                        role: result.data.role === 'admin' ? "admin" : "member",
                    });
                    break;
                default:
                    break;
            }

            return new Response(null, {
                status: 200,
            });
        } catch (err) {
            console.log(err);
            return new Response('Webhook Error', {
                status: 400,
            });
        }
    }),
});

export default http;
