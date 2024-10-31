import { Button, Form, Input, message, Modal } from 'antd'
import { useState } from 'react'
import axios from "axios";

interface BindIpProps {
	getAllAuths: () => void;
	licenseId: string;
	disabled?: boolean;
}

export const BindIp = ({ getAllAuths, licenseId, disabled }: BindIpProps) => {
	const [form] = Form.useForm()
	const [bindIpModalOpen, setBindIpModalOpen] = useState(false)

	const showBindIpModal = () => {
		setBindIpModalOpen(true)
	}
	const cancelBindIpModal = () => {
		setBindIpModalOpen(false)
	}
	const handleBindIp = () => {
		form
			.validateFields()
			.then(async values => {
				const newValues = {
					...values,
					licenseId: licenseId,
				}
				try {
					const res = await axios.post('/api/license/ip/bindIp',newValues )
					if (res.status === 200) {
						getAllAuths()
						cancelBindIpModal()
						message.success(res.data.message)
					}
					if (res.status === 500) {
						message.error(res.data.message)
					}
				} catch (error) {
					message.error('失敗')
				}
			})
			.catch(info => {
				console.log('Validate Failed:', info)
			})
	}

	return (
		<div>
			<Button
				type="link"
				disabled={disabled}
				onClick={() => {
					return showBindIpModal()
				}}
			>
				IP綁定
			</Button>
			<Modal
				title={<div className="mt-2 mb-5 ">IP綁定</div>}
				open={bindIpModalOpen}
				closeIcon={false}
				destroyOnClose={true}
				onOk={form.submit}
				onCancel={cancelBindIpModal}
				className="text-center"
				bodyStyle={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '60px',
				}}
				width={470}
			>
				<Form
					form={form}
					preserve={false}
					onFinish={handleBindIp}
					name="basic"
					initialValues={{
						remember: true,
					}}
					autoComplete="off"
				>
					<Form.Item
						label="IP"
						name="ip"
						rules={[
							{
								required: true,
								message: '請輸入IP名稱',
							},
							{
								pattern: /^(\d{1,3}\.){3}\d{1,3}$/,
								message: '請輸入有效的IP地址',
							},
						]}
						colon={false}
					>
						<Input className="w-50" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}
