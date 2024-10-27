import { message, Form, Input, Modal } from 'antd'
import axios from "axios";

interface AddAgentProps {
	open: boolean
	onCancel: () => void
		callBack: () => void
}

export const AddAgent = ({ open, onCancel, callBack }: AddAgentProps) => {
	const [form] = Form.useForm()

	const onFinish = () => {
		form
			.validateFields()
			.then(async values => {
					try {
						const res = await axios.post('/api/agent/add',values )
						if (res?.data?.status === true) {
							callBack()
							onCancel()
							message.success(res?.data.message)
						}
					} catch (error) {
						message.error('失敗')
					}

			})
			.catch(info => {
				message.error('失敗')
			})
	}

	return (
		<div>
			<Modal
				destroyOnClose={true}
				closeIcon={false}
				keyboard
				title={<div className="mt-2 mb-5 ">新增代理商</div>}
				open={open}
				onOk={form.submit}
				onCancel={onCancel}
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
					name="basic"
					onFinish={onFinish}
					initialValues={{
						remember: true,
					}}
					autoComplete="off"
				>
					<Form.Item
						label="代理商名稱"
						name="name"
						rules={[
							{
								required: true,
								message: '請輸入代理商名稱',
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
