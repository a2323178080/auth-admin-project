import { Menu } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import Link from 'next/link'

const { SubMenu, Item } = Menu

export const SideMenu = () => {

	return (
			<Menu
				className="max-w-64"
				mode="inline"
				theme={'dark'}
			>
				<Item key={'/'} icon={<HomeOutlined />}>
					<Link href={'/agents'}>總覽</Link>
				</Item>
			</Menu>
		)
}
