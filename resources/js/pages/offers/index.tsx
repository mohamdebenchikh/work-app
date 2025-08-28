import Heading from "@/components/heading";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '/'
    },
    {
        title: 'Offers',
        href: '/offers'
    }
]

export default function OffersIndex() {


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Offers" />

            <div className='py-12'>
                <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
                    <Heading title="Offers" description="" />
                </div>
            </div>
        </AppLayout>
    )

}