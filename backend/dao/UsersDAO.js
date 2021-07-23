import mongodb from 'mongodb';
const ObjectID = mongodb.ObjectId;

let users;

export default class UsersDAO {
    static async injectDB(conn) {
        if (users) return;

        try {
            users = await conn.db(process.env.DREAMWORLD_NS).collection("users");
        } catch (e) {
            console.error(`Could not establish a connection handle to the database: ${e}`);
        }
    }

    static async addUser(newUser) {
        try {
            const result = await users.insertOne(newUser);

            return result;
        } catch (e) {
            console.error(`Unable to insert user into database: ${e}`);
            return { error: e };
        }
    }

    static async updateUser(user) {
        try {
            const updateResult = await users.updateOne(
                { _id: { $eq: user._id }},
                {
                    name: user.name,
                    handle: user.handle,
                    bio: user.bio,
                }
            );

            return updateResult;
        } catch (e) {
            console.error(`Unable to update user in database: ${e}`);
            return { error: e };
        }
    }
}