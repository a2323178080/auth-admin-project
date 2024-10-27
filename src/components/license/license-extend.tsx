import { useState } from 'react'
import { Button, DatePicker, Form, Input, message, Modal } from 'antd'
import dayjs from 'dayjs'
import axios from "axios";

interface LicenseExtendProps {
	getAllAuths: () => void; // 函數類型，無返回值
	authExtendStartDate: string; // 授權起始日
	authName: string; // 機房名稱
	licenseId: string; // 授權 ID
	disabled: boolean; // 按鈕禁用狀態
}

export const LicenseExtend = ({
	getAllAuths,
	authExtendStartDate,
	authName,
	licenseId,
	disabled,
}: LicenseExtendProps) => {
	const disabledDate = current => {
		const authStartDate = dayjs(authExtendStartDate)
		return current && current.isBefore(authStartDate.add(1, 'day'), 'day')
	}

	const [form] = Form.useForm()
	const [authExtendModalOpen, setAuthExtendModalOpen] = useState<boolean>(false)
	const showAuthExtendModal = () => {
		setAuthExtendModalOpen(true)
	}
	const cancelAuthExtendModal = () => {
		setAuthExtendModalOpen(false)
		form.resetFields()
	}
	const handleAuthExtend = () => {
		form
			.validateFields()
			.then(async values => {
				const newValues = {
					...values,
					expiredDate: values.expiredDate.format('YYYY-MM-DD'),
					licenseId: licenseId,
				}
				setAuthExtendModalOpen(false)
				try {
					const res = await axios.post('/api/license/extension/extend',newValues )

					if (res?.data?.status === true) {
						getAllAuths()
						message.success(res?.data.message)
					}
				} catch (error) {
					message.error('失敗')
				}
				form.resetFields()
				setAuthExtendModalOpen(false)
			})
			.catch(info => {
				message.error('失敗')
			})
	}

	return (
		<div>
			<Button
				type="link"
				disabled={disabled}
				onClick={() => {
					return showAuthExtendModal()
				}}
			>
				機房授權延長
			</Button>
			<Modal
				title={<div className="mt-2 mb-5 ">機房授權延長</div>}
				open={authExtendModalOpen}
				onCancel={cancelAuthExtendModal}
				onOk={form.submit}
				closeIcon={false}
				className="text-center"
				bodyStyle={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
				width={470}
			>
				<Form
					form={form}
					name="basic"
					onFinish={handleAuthExtend}
					initialValues={{
						remember: true,
					}}
					autoComplete="off"
				>
					<Form.Item
						label={
							<span>
								<span className="text-red-600">*</span>
								<span className="ml-1">機房名稱</span>
							</span>
						}
						name="authName"
						colon={false}
					>
						<p className="text-start ml-3">{authName}</p>
					</Form.Item>

					<Form.Item
						label={
							<span>
								<span className="text-red-600">*</span>
								<span className="ml-1">授權起始日</span>
							</span>
						}
						name="authExtendStartDate"
						colon={false}
					>
						<p className="text-start ">{authExtendStartDate}</p>
					</Form.Item>

					<Form.Item
						label="授權到期日"
						name="expiredDate"
						rules={[
							{
								required: true,
								message: '請輸入授權到期日',
							},
						]}
						colon={false}
					>
						<DatePicker disabledDate={disabledDate} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}
