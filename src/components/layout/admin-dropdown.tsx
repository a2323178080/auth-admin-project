import { UserOutlined } from '@ant-design/icons'
import { Dropdown, Space, Button, Avatar, message } from 'antd'
import {useRouter} from "next/router";

export const AdminDropdown = () => {
	const router= useRouter()

	const logout = () => {
		document.cookie.split(";").forEach((cookie) => {
			document.cookie = cookie
				.replace(/^ +/, "")
				.replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
		});

		router.replace('/');
	};
	const items = [
		{
			key: '1',
			// label: <PasswordChange />,
		},
		{
			key: '2',
			label: (
				<Button type="text" onClick={logout}>
					登出系統
				</Button>
			),
		},
	]

	return (
		<div>
			<Dropdown
				className="pr-5"
				menu={{
					items,
				}}
				trigger={['click']}
			>
				<a onClick={e => e.preventDefault()} className="cursor-pointer">
					<Space>
						<Avatar size="small" icon={<UserOutlined />} />
						Admin
					</Space>
				</a>
			</Dropdown>
		</div>
	)
}
