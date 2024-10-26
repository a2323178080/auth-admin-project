import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your-secret-key';  // 設置你的秘密鑰匙，應該存放在環境變數中

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, password } = req.body;

    // 假設的帳號密碼驗證邏輯
    const validUser = {
        username: process.env.NEXT_PUBLIC_USERNAME ,
        password: process.env.NEXT_PUBLIC_PASSWORD,
    };

    // 驗證帳號和密碼
    if (username === validUser.username && password === validUser.password) {
        // 在這裡生成 JWT
        const token = jwt.sign(
            {
                userId: '7c0c29ea-3f9d-4662-a3d4-389bf30c4b09', // 用戶ID
                username: validUser.username, // 用戶名
                name: '最高管理員', // 用戶名稱
            },
            SECRET_KEY, // 加密的秘密鑰匙
            { expiresIn: '1h' } // Token 有效期為1小時
        );

        const decodedToken = jwt.decode(token);

        // 返回成功的結果和生成的 JWT Token
        return res.status(200).json({
            errorCode: 'LOGIN_SUCCESS',
            status: true,
            message: '登入成功',
            data: {
                userId: '7c0c29ea-3f9d-4662-a3d4-389bf30c4b09',
                name: '最高管理員',
                token, // 返回 JWT Token
                expired: decodedToken.exp * 1000
            },
        });
    } else {
        // 帳號或密碼錯誤時的返回結果
        return res.status(401).json({
            errorCode: 'LOGIN_ACCOUNT_OR_PASSWORD_ERROR',
            status: false,
            message: '帳號密碼錯誤',
        });
    }
}
