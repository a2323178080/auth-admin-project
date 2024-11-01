import type { NextApiRequest, NextApiResponse } from 'next';
import licenses from '../../data/licenses'
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

    if (req.method === 'GET') {
        const { agentId } = req.query;

        // 检查 agentId 是否存在
        if (!agentId || typeof agentId !== 'string') {
            return res.status(400).json({
                errorCode: 'ID_REQUIRED',
                status: false,
                message: '代理商 ID 是必填的',
                data: [],
            });
        }

        // 根據 agentId 篩選授權列表
        const agentLicenses = licenses.filter(license => license.agentId === agentId);

        // 如果未找到授權列表
        if (agentLicenses.length === 0) {
            return res.status(200).json({
                errorCode: 'LICENSES_NOT_FOUND',
                status: false,
                message: '未找到對應的授權列表',
                data: [],
            });
        }

        // 返回成功响应
        return res.status(200).json({
            errorCode: 'REQUEST_SUCCESS',
            status: true,
            message: '請求成功',
            data: agentLicenses,
        });
    } else {
        // 如果请求方法不是 GET，返回 405
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({
            errorCode: 'METHOD_NOT_ALLOWED',
            status: false,
            message: '不支持此請求',
            data: [],
        });
    }
}
