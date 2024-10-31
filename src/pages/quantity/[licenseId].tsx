import {Toolbar} from '@/components/toolbar'
import QuantityTable from '@/components/quantity/quantity-table'
import {LinkBreadcrumb} from '@/components/link-breadcrumb'

export default ({licenseId}) => {
    const quantityInformationPage = [
        {
            path: `/licenses`,
            title: <span className="text-sm">機房授權列表</span>,
        },
        {
            path: `/quantity`,
            title: <span className="text-sm">數量詳情</span>,
        },
    ]

    return (
        <div>
            <LinkBreadcrumb items={quantityInformationPage} />
            <Toolbar returnButton />
            <div>
                <QuantityTable licenseId={licenseId} />
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const { licenseId } = context.params;
    return { props: { licenseId } };
}