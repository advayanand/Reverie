import UsersDAO from '../dao/UsersDAO.js';

export default class UsersController {
    static async apiCreateUser(req, res, next) {
        console.log('received');
        try {
            console.log(req.body);
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

            const result = await UsersDAO.addUser(newUser);

            res.json({ status: 'success' });
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
            const _id = req.body._id;

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
}