import type { NextApiRequest, NextApiResponse } from 'next';
import quantityData from '../../../data/quantity';
import jwt from 'jsonwebtoken';
const SECRET_KEY = 'your-secret-key';

export default function handler (req: NextApiRequest, res: NextApiResponse) {

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

    const { licenseId } = req.query;
    if (req.method === 'GET') {
        const data = quantityData.find(item => item.licenseId === licenseId);
        if (data) {
            res.status(200).json({
                errorCode: 'REQUEST_SUCCESS',
                status: true,
                message: '請求成功',
                data: data,
            });
        } else {
            res.status(200).json({
                errorCode: 'LICENSE_NOT_FOUND',
                status: false,
                message: '尚無資料',
                data: [],
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({
            errorCode: 'METHOD_NOT_ALLOWED',
            status: false,
            message: `Method ${req.method} not allowed`,
        });
    }
};


