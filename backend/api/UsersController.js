import UsersDAO from '../dao/UsersDAO.js';

export default class UsersController {
    static async apiCreateUser(req, res, next) {
        console.log('received');
        try {
            console.log(req.body);
            console.log(req.headers.origin);
            const name = req.body.name;
            const handle = req.body.handle;
            const bio = req.body.bio;
            
            const createdDate = new Date();

            const newUser = {
                name,
                handle,
                bio,
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
}