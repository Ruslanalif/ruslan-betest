import jwt from 'jsonwebtoken';

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        req.db_conn.open();
        // console.log("mongo connected");
        const w = await req.db_conn.db.collection("account_login").findOne({session_id : refreshToken});
        if(!w) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const xUserName = w.userName;
            const xLastLogin = w.lastLogin;
            const accessToken = jwt.sign({xUserName, xLastLogin}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '20s'
            });
            res.json({accessToken});    
        });
    } catch (error) {
        console.log(error);
    }
}