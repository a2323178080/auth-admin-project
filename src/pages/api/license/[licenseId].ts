import type { NextApiRequest, NextApiResponse } from 'next';
import licenses from '../../../data/licenses';
import jwt from 'jsonwebtoken';
const SECRET_KEY = 'your-secret-key';

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    // 判斷是否有token
    const authHeader = req.headers.cookie;
    if (!authHeader) {
        return res.status(401).json({ success: false, message: ["未授權"] });
    }

    // 判斷token是否正確
    // 使用正則表達式提取 hexToken
    const hexTokenMatch = authHeader.match(/hexToken=([^;]+)/);
    const hexToken = hexTokenMatch ? hexTokenMatch[1] : null;
    console.log("hexToken@@",hexToken)
    if (!hexToken) {
        return res.status(401).json({ success: false, message: ["無效的Token"] });
    }

    try {
        jwt.verify(hexToken, SECRET_KEY);
    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(401).json({ success: false, message: ["無效的Token"] });
    }

    if (req.method === 'DELETE') {
        const { licenseId } = req.query;

        // 找到對應的授權資料索引
        const licenseIndex = licenses.findIndex((license) => license.id === licenseId);

        if (licenseIndex === -1) {
            // 若找不到授權資料，回傳 404 錯誤
            return res.status(404).json({
                errorCode: 'LICENSE_NOT_FOUND',
                status: false,
                message: '找不到授權資料',
            });
        }

        // 刪除授權資料
        licenses.splice(licenseIndex, 1);

        // 回傳刪除成功訊息
        return res.status(200).json({
            errorCode: 'REMOVE_SUCCESS',
            status: true,
            message: '刪除成功',
        });
    } else {
        // 如果請求方法不是 DELETE，返回 405
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).json({
            errorCode: 'METHOD_NOT_ALLOWED',
            status: false,
            message: '不支援此請求方法',
        });
    }
}
