import type { NextApiRequest, NextApiResponse } from 'next';
import licenses from '../../../../data/licenses';
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
        const { ipId } = req.query;

        // 檢查 ipId 是否存在
        if (!ipId) {
            return res.status(400).json({
                errorCode: 'INVALID_REQUEST',
                status: false,
                message: '缺少必要的 ipId 參數',
            });
        }

        // 找到包含該 IP 的授權項目
        let ipFound = false;
        for (const license of licenses) {
            const ipIndex = license.ipList.findIndex((ip) => ip.id === ipId);
            if (ipIndex !== -1) {
                // 移除指定的 IP 綁定
                license.ipList.splice(ipIndex, 1);
                ipFound = true;
                break;
            }
        }

        // 如果找到並刪除 IP，返回成功訊息
        if (ipFound) {
            return res.status(200).json({
                errorCode: 'REMOVE_SUCCESS',
                status: true,
                message: '刪除成功',
            });
        } else {
            // 如果找不到對應的 IP，返回 404
            return res.status(404).json({
                errorCode: 'IP_NOT_FOUND',
                status: false,
                message: '找不到指定的 IP 綁定',
            });
        }
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
