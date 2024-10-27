import React from 'react'
import { Button, message, Modal, Space } from 'antd'
import axios from "axios";

interface DeleteLicenseProps {
	licenseId: string;
	startDate: string;
	expiredDate: string;
	getAllAuths: () => void;
}

	export const DeleteLicense = ({
		licenseId,
		startDate,
		expiredDate,
		getAllAuths,
	}: DeleteLicenseProps) => {

	const handleDeleteAuth = async () => {
		try {
			const res = await axios.delete(`/api/license/${licenseId}`);

			if (res?.data?.status === true) {
				getAllAuths()
				Modal.destroyAll()
				message.success(res?.data.message)
			} else {
				message.error(res?.data.message)
			}
		} catch (error) {
			message.error('失敗')
		}
	}

	return (
		<div>
			<Button
				type="link"
				danger
				onClick={() => {
					Modal.confirm({
						title: (
							<div className="mt-2 mb-5">
								刪除授權
							</div>
						),
						className: 'text-center',
						bodyStyle: {
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							height: '155px',
						},
						width: 320,
						icon:null,
						content: (
							<div>
								<p>
									授權時間: {startDate} ~ {expiredDate}
								</p>
								<p className="mb-5">您確定要刪除此授權嗎?</p>
							</div>
						),
						footer: (_, { OkBtn, CancelBtn }) => (
							<>
								<CancelBtn />
								<Button type="primary" onClick={handleDeleteAuth}>確定</Button>
							</>
						),
					})
				}}
			>
				刪除授權
			</Button>
		</div>
	)
}
