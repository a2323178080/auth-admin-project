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

    if (req.method === 'POST') {
        const { licenseId, ip } = req.body;

        // 驗證請求的必要參數是否存在
        if (!licenseId || !ip) {
            return res.status(400).json({
                errorCode: 'INVALID_REQUEST',
                status: false,
                message: '缺少必要的 licenseId 或 ip 參數',
            });
        }

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

        // 檢查 IP 是否已綁定
        const ipExists = license.ipList.some((entry) => entry.ip === ip);
        if (ipExists) {
            return res.status(409).json({
                errorCode: 'IP_ALREADY_BOUND',
                status: false,
                message: '此 IP 已經綁定',
            });
        }

        // 新增 IP 綁定
        const newIpEntry = {
            id: `${Date.now()}`, // 使用時間戳產生唯一 ID
            ip: ip,
            createTime: new Date().toISOString(),
        };
        license.ipList.push(newIpEntry);

        // 回傳新增成功訊息
        return res.status(200).json({
            errorCode: 'INSERT_SUCCESS',
            status: true,
            message: '新增成功',
        });
    } else {
        // 如果請求方法不是 POST，返回 405
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({
            errorCode: 'METHOD_NOT_ALLOWED',
            status: false,
            message: '不支援此請求方法',
        });
    }
}
