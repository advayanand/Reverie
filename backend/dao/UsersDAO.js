import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId;

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

    static async createUser(newUser) {
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
                { _id: { $eq: ObjectId(user._id) } },
                {
                    $set: {
                        name: user.name,
                        handle: user.handle,
                        bio: user.bio,
                    }
                }
            );

            return updateResult;
        } catch (e) {
            console.error(`Unable to update user in database: ${e}`);
            return { error: e };
        }
    }

    static async deleteUser(_id) {
        try {
            const deleteResult = await users.deleteOne({
                _id: { $eq: ObjectId(_id) }
            });

            return deleteResult;
        } catch (e) {
            console.error(`Unable to delete user in database`);
            return { error: e };
        }
    }
}