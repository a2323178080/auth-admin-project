import {AdminDropdown} from './admin-dropdown'

export const Header = () => {
	return (
		<div className="flex justify-between items-center py-4 px-2 shadow-md relative bg-sky-100">
			<div className="pl-5 "></div>
			<div>
				<AdminDropdown />
			</div>
		</div>
	)
}
