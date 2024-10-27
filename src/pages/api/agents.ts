import type { NextApiRequest, NextApiResponse } from 'next';
import agents from '../../data/agents';
import jwt from 'jsonwebtoken';
const SECRET_KEY = 'your-secret-key';

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    // 判斷是否有token
    const authHeader = req.headers.cookie;
    if (!authHeader) {
        return res.status(401).json({ success: false, message: ["未授權"] });
    }

    // 判斷token是否正確
    try {
        const jwtToken = authHeader.split('=')[1];
        jwt.verify(jwtToken, SECRET_KEY);
    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(401).json({ success: false, message: ["無效的Token"] });
    }

    if (req.method === 'GET') {
        return res.status(200).json({
            errorCode: 'REQUEST_SUCCESS',
            status: true,
            message: '請求成功',
            data: agents,
        });
    } else {
        // 如果方法不被允許，返回405錯誤
        res.setHeader('Allow', ['GET']);
        return res.status(405);
    }
}
