import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId;

let users;
let pwds;

export default class UsersDAO {
    static async injectDB(conn) {
        if (users) return;

        try {
            users = await conn.db(process.env.REVERIE_NS).collection("users");
            pwds = await conn.db(process.env.REVERIE_NS).collection("pwds");
        } catch (e) {
            console.error(`Could not establish a connection handle to the database: ${e}`);
        }
    }

    static async getUser(user_id) {
        try {
            const result = await users.findOne(
                {
                    _id: { $eq: ObjectId(user_id) }
                }
            );

            return result;
        } catch (e) {
            console.error(`Unable to get user from database: ${e}`);
            return { error: e };
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

    static async deleteUser(user_id) {
        try {
            const deleteResult = await users.deleteOne({
                _id: { $eq: ObjectId(user_id) }
            });

            return deleteResult;
        } catch (e) {
            console.error(`Unable to delete user in database`);
            return { error: e };
        }
    }

    static async authenticateUser(user) {
        try {
            const userdoc = await users.findOne(
                {
                    email: { $eq: user.email }
                }
            );
            console.log(userdoc);
            const user_id = userdoc._id;

            // console.log(user_id);

            const pwddoc = await pwds.findOne(
                {
                    user_id: { $eq: ObjectId(user_id) }
                }
            );
            const userpwd = pwddoc.pwd;

            console.log(userpwd);
            
            if (user.pwd !== userpwd) {
                // handle incorrect password !!!
                // returning null if incorrect password - better solution later
                return null;
            }

            console.log(user_id);

            return user_id;
        } catch (e) {
            console.error(`Unable to authenticate user in database: ${e}`);
            return { error: e };
        }
    }
}