import type { NextApiRequest, NextApiResponse } from 'next';
import licenses from '../../../data/licenses';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
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
        const { agentId, name, startDate, expiredDate, isEnable } = req.body;

        // 驗證必填欄位
        if (!agentId || !name || !startDate || !expiredDate) {
            return res.status(400).json({
                errorCode: 'INVALID_INPUT',
                status: false,
                message: '缺少必要的欄位',
            });
        }

        // 建立新的授權物件
        const newLicense = {
            id: uuidv4(),
            agentId,
            agentName: licenses.find(license => license.agentId === agentId)?.agentName || "未知代理商",
            name,
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            startDate,
            expiredDate,
            isEnable: isEnable !== undefined ? isEnable : true,
            companySum: 0,
            brandSum: 0,
            posSum: 0,
            byodSum: 0,
            byodTogoSum: 0,
            reserveByodTogoSum: 0,
            ipList: [],
        };

        // 將新的授權資料加入模擬數據
        licenses.push(newLicense);

        // 回傳成功訊息
        return res.status(201).json({
            errorCode: 'INSERT_SUCCESS',
            status: true,
            message: '新增成功',
            data: newLicense,
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
