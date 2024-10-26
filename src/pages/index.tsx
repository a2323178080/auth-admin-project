import { Button, Form, Input, message } from 'antd'
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons'

import {useRouter} from "next/router";
import axios from "axios";

const initialUsername = process.env.NEXT_PUBLIC_USERNAME || ""
const initialPassword = process.env.NEXT_PUBLIC_PASSWORD || ""

interface LoginFormValues {
    username: string
    password: string
}

// 首頁
export default function Login() {
    const router= useRouter()
  const onFinish = async (value: LoginFormValues) => {
       try {
           const res = await axios.post(
                  // 登入
                  "/api/login"
                  , value);
              const { token, expired } = res?.data?.data;
              document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
              if (res?.data?.status === true) {
                  message.success(res.data.message)
                  router.push('/agents')
              }
          } catch (error: any) {
              message.error("登入失敗");
          }
      };

  return (
      <>
        <div className="text-lg font-bold mb-4 text-center">Shoperlink授權管理</div>
        <Form name={'login-form'} onFinish={onFinish}>
          <Form.Item
              name="username"
              initialValue={initialUsername}
              rules={[{ required: true,message: '請輸入使用者帳號',}]}
              validateTrigger={['onChange', 'onBlur']}
          >
            <Input placeholder="使用者帳號" />
          </Form.Item>
          <Form.Item
              name="password"
              initialValue={initialPassword}
              rules={[{ required: true,message: '請輸入使用者密碼' }]}
              validateTrigger={['onChange', 'onBlur']}
          >
            <Input.Password
                iconRender={visible =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                placeholder="使用者密碼"
            />
          </Form.Item>
            <div className="text-center">
                <Button type="primary" htmlType="submit">
                    登入系統
                </Button>
            </div>
        </Form>
      </>
  )
}

Login.getLayout = function (page) {
    return (
        <>
            <div className="bg-gray-200 min-w-max min-h-screen flex items-center justify-center">
                <div className="p-6 bg-white shadow-md rounded">{page}</div>
            </div>
        </>
    )
}