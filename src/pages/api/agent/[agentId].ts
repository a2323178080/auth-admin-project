import type { NextApiRequest, NextApiResponse } from 'next';
import agents from '../../../data/agents';
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

    if (req.method === 'DELETE') {
        const { agentId } = req.query;
        // 檢查是否有 agentId
        if (!agentId || typeof agentId !== 'string') {
            return res.status(400).json({
                errorCode: 'ID_REQUIRED',
                status: false,
                message: '代理商 ID 是必填的',
            });
        }

        // 查找代理商的索引
        const agentIndex = agents.findIndex(agent => agent.id === agentId);
        if (agentIndex === -1) {
            return res.status(404).json({
                errorCode: 'AGENT_NOT_FOUND',
                status: false,
                message: '代理商未找到',
            });
        }

        // 移除代理商
        agents.splice(agentIndex, 1);

        // 返回成功響應
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
            message: '不支持此请求方法',
        });
    }
}
