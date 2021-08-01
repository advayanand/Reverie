import UsersDAO from '../dao/UsersDAO.js';

export default class UsersController {

    static async apiGetUser(req, res, next) {
        try {
            const user_id = req.params.user_id;
            const user = await UsersDAO.getUser(user_id);

            res.json(user);
        } catch (e) {
            console.error(`Unable to get user: ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiCreateUser(req, res, next) {
        try {
            const name = req.body.name;
            const handle = req.body.handle;
            const bio = req.body.bio;
            
            const createdDate = new Date();

            const newUser = {
                name,
                handle,
                bio,
                followerCount: 0,
                followingCount: 0,
                createdDate
            };

            const result = await UsersDAO.createUser(newUser);

            res.status(201).json({ status: 'success' });
        } catch (e) {
            console.error(`Unable to create new user: ${e}`);
            res.status(500).json({ error: e });
        }
        
    }

    static async apiUpdateUser(req, res, next) {
        try {
            const name = req.body.name;
            const handle = req.body.handle;
            const bio = req.body.bio;
            const _id = req.params.id;

            const newUserInfo = {
                _id,
                name,
                handle,
                bio
            };

            const result = await UsersDAO.updateUser(newUserInfo);

            res.json({ status: 'success' });
        } catch (e) {
            console.error(`Unable to update user: ${e}`);
            res.status(500).json({ error: e });
        }
        
    }

    static async apiDeleteUser(req, res, next) {
        try {
            const _id = req.params.id;

            const result = await UsersDAO.deleteUser(_id);

            res.status(204).json({ status: 'success' });
        } catch (e) {
            console.error(`Unable to delete user: ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiAuthenticateUser(req, res, next) {
        try {
            // const user_id = req.body.user_id;
            const email = req.body.email;
            const pwd = req.body.pwd;

            const authenticated_user_id = await UsersDAO.authenticateUser(
                {
                    email,
                    pwd
                }
            );

            console.log('user id: ' + authenticated_user_id);

            if (!authenticated_user_id) {
                res.status(401).end();
            } else {
                res.json({
                    user_id: authenticated_user_id
                });
            }
        } catch (e) {
            console.error(`Unable to authenticate user: ${e}`);
            res.status(500).json({ error: e });
        }
    }
}