import { NextApiRequest, NextApiResponse } from 'next';
import licenses from '../../../../data/licenses';
import jwt from 'jsonwebtoken';
const SECRET_KEY = 'your-secret-key';

const handler = (req: NextApiRequest, res: NextApiResponse) => {

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
        const { licenseId, expiredDate } = req.body;

        // 找到對應的 license
        const licenseIndex = licenses.findIndex(lic => lic.id === licenseId);

        if (licenseIndex !== -1) {
            // 更新授權的到期日期
            licenses[licenseIndex].expiredDate = expiredDate;

            // 回傳成功訊息
            return res.status(200).json({
                errorCode: "INSERT_SUCCESS",
                status: true,
                message: "新增成功",
            });
        } else {
            // 找不到對應的 license
            return res.status(404).json({
                errorCode: "LICENSE_NOT_FOUND",
                status: false,
                message: "找不到對應的授權",
            });
        }
    } else {
        // 只允許 POST 方法
        return res.status(405).json({
            errorCode: "METHOD_NOT_ALLOWED",
            status: false,
            message: "方法不被允許",
        });
    }
};

export default handler;
