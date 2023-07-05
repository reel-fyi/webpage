import { getAuth, clerkClient } from "@clerk/nextjs/server";
import PocketBase from 'pocketbase';
import 'cross-fetch/polyfill';
import type { NextApiRequest, NextApiResponse } from 'next';

type Profile = {
    name?: string,
    bio?: string,
    error: boolean,
    message?: string,
}

/*
CASES FOR THIS API:
1. DONE - User has no local storage data or account in current users collection (new user)
2. User has no local storage data but has an account in current users collection (migrate user)
3. User has local storage data but no account in current users collection (recover user)
*/

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Profile>
) {
    const auth = getAuth(req);
    const { userId } = auth;
    
    if (userId) {
        const user = await clerkClient.users.getUser(userId);
        if (user) {
            const pb = new PocketBase(process.env.NEXT_PUBLIC_API_URL);
            const name = user?.firstName + " " + user?.lastName;
            const email = user?.emailAddresses[0].emailAddress;
            const data:{
                clerk_user_id: string,
                name: string,
                email?: string,
                new_user: boolean,
                bio?: string,
            } = {
                clerk_user_id: userId,
                name,
                email,
                new_user: true,
            }
            try {
                const oldUserRecord = await pb.collection('users').getFirstListItem(`email="${email}"`);
                console.log(oldUserRecord);
                if (oldUserRecord) {
                    data.new_user = false;
                    data['bio'] = oldUserRecord['bio'];
                }
            } catch {};
            try {
                const profile = await pb.collection('profiles').create(data);
                return res.status(200).json({ name, bio: profile['bio'], error: false });
            } catch (e) {
                return res.status(400).json({ error: true, message: e as string });
            }
        }
    }
    return res.status(400).json({ error: true, message: "No user found" });
}