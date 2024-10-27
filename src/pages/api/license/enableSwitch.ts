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
    try {
        const jwtToken = authHeader.split('=')[1];
        jwt.verify(jwtToken, SECRET_KEY);
    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(401).json({ success: false, message: ["無效的Token"] });
    }

    if (req.method === 'PUT') {
        const { licenseId, isEnable } = req.body;

        // 找到對應的授權資料
        const license = licenses.find((license) => license.id === licenseId);

        if (!license) {
            // 若找不到授權資料，回傳 404 錯誤
            return res.status(404).json({
                errorCode: 'LICENSE_NOT_FOUND',
                status: false,
                message: '找不到授權資料',
            });
        }

        // 更新授權的 isEnable 狀態
        license.isEnable = isEnable;

        // 回傳更新成功訊息
        return res.status(200).json({
            errorCode: 'UPDATE_SUCCESS',
            status: true,
            message: '修改成功',
        });
    } else {
        // 如果請求方法不是 PUT，返回 405
        res.setHeader('Allow', ['PUT']);
        return res.status(405).json({
            errorCode: 'METHOD_NOT_ALLOWED',
            status: false,
            message: '不支援此請求方法',
        });
    }
}
