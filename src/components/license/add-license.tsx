import { DatePicker, Form, Input, message, Modal, Switch } from 'antd'
import dayjs from 'dayjs'
import axios from "axios";
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

interface AddLicenseProps {
	AddModalOpen: boolean;
	cancelAddModal: () => void;
	getAllAuths: () => void;
	id: string;
}

export const AddLicense = ({ AddModalOpen, cancelAddModal, getAllAuths, id }: AddLicenseProps) => {
	const disabledDate = (current: dayjs.Dayjs | null): boolean => {
		return !!current && current < dayjs().startOf('day')
	}
	const validateEndDate = (rule: any, endDate: dayjs.Dayjs) => {
		const startDate = form.getFieldValue('startDate' as any)
		if (startDate && endDate && dayjs(endDate).isBefore(startDate)) {
			return Promise.reject('授權到期日不能早於授權起始日期')
		}
		return Promise.resolve()
	}

	const [form] = Form.useForm()
	const onFinish = () => {
		form
			.validateFields()
			.then(async values => {
				const newValues = {
					...values,
					startDate: values.startDate.format('YYYY-MM-DD'),
					expiredDate: values.expiredDate.format('YYYY-MM-DD'),
					agentId: id,
					isEnable: values.isEnable === undefined ? true : false,
				}
				try {
					const res = await axios.post('/api/license/add',newValues )
					if (res?.data?.status === true) {
						getAllAuths()
						cancelAddModal()
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
				title={<div className="mt-2 mb-5 ">新增授權</div>}
				open={AddModalOpen}
				onCancel={cancelAddModal}
				onOk={onFinish}
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
					preserve={false}
					name="basic"
					initialValues={{
						remember: true,
					}}
					autoComplete="off"
				>
					<Form.Item
						label="機房名稱"
						name="name"
						rules={[
							{
								required: true,
								message: '請輸入授權名稱',
							},
						]}
						colon={false}
						wrapperCol={{
							offset: 2,
						}}
					>
						<Input className="w-50" />
					</Form.Item>
					<Form.Item
						label="授權起始日"
						name="startDate"
						rules={[
							{
								required: true,
								message: '請輸入授權起始日',
							},
						]}
						colon={false}
					>
						<DatePicker disabledDate={disabledDate} />
					</Form.Item>
					<Form.Item
						label="授權到期日"
						name="expiredDate"
						rules={[
							{
								required: true,
								message: '請輸入授權到期日',
							},
							{
								validator: validateEndDate,
							},
						]}
						colon={false}
					>
						<DatePicker disabledDate={disabledDate} />
					</Form.Item>
					<Form.Item
						label={
							<span>
								<span className="text-red-600">*</span>
								<span className="ml-1">啟用狀態</span>
							</span>
						}
						name="isEnable"
						valuePropName="checked"
						colon={false}
					>
						<Switch defaultChecked className="-ml-24" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}
