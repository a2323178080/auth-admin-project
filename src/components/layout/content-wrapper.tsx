import { ReactNode } from 'react';

interface ContentWrapperProps {
	children: ReactNode;
}

export const ContentWrapper = ({ children }: ContentWrapperProps) => {
	return <main className='p-4 bg-white shadow-md rounded-md m-4'>{children}</main>
}
