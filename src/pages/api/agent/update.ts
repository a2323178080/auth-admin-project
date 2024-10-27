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

    if (req.method === 'PUT') {
        const { id, name } = req.body;

        if (!id || !name) {
            return res.status(400).json({
                errorCode: 'INVALID_PAYLOAD',
                status: false,
                message: 'id 和 name 是必填的',
            });
        }

        // 查找代理商
        const agentIndex = agents.findIndex(agent => agent.id === id);
        if (agentIndex === -1) {
            return res.status(404).json({
                errorCode: 'AGENT_NOT_FOUND',
                status: false,
                message: '代理商未找到',
            });
        }
        // 更新代理商信息
        agents[agentIndex].name = name;

        // 返回成功
        return res.status(200).json({
            errorCode: 'UPDATE_SUCCESS',
            status: true,
            message: '修改成功',
        });
    } else {
        // 如果請求方法不是PUT，返回405
        res.setHeader('Allow', ['PUT']);
        return res.status(405).json({
            errorCode: 'METHOD_NOT_ALLOWED',
            status: false,
            message: '不支持此請求方法',
        });
    }
}
