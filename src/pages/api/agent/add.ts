import type { NextApiRequest, NextApiResponse } from 'next';
import agents, { addAgent } from '../../../data/agents';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import jwt from "jsonwebtoken";
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

    if (req.method === 'POST') {
        const { name } = req.body;
        // 驗證name是否存在
        if (!name) {
            return res.status(400).json({
                errorCode: 'NAME_REQUIRED',
                status: false,
                message: '代理商名稱是必填的',
                data: {},
            });
        }

        // 檢查代理商是否已存在
        const existingAgent = agents.find(agent => agent.name === name);
        if (existingAgent) {
            return res.status(409).json({
                errorCode: 'AGENT_ALREADY_EXISTS',
                status: false,
                message: '代理商已經存在',
                data: {},
            });
        }

        // 建立新的代理商
        const newAgent = {
            id: uuidv4(),
            name,
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            licenseCount: 0,
            licenseIpCount: 0,
        };

        // 將新的代理商加入資料庫（模擬加入）
        addAgent(newAgent);

        // 回應成功訊息
        return res.status(201).json({
            errorCode: 'AGENT_ADDED_SUCCESSFULLY',
            status: true,
            message: '代理商新增成功',
            data: newAgent,
        });
    } else {
        // 如果請求方法不是POST，返回405
        res.setHeader('Allow', ['POST']);
        return res.status(405)
    }
}
