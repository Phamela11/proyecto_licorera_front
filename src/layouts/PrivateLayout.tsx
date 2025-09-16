import { Outlet } from 'react-router-dom';
import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/sidebar"

const PrivateLayout = () => {  
    return (
        <div className='w-full h-screen flex flex-col bg-gray-50'>
            <Header />
            <div className='flex flex-row w-full h-[calc(100%-64px)]'>
                <Sidebar />
                <div className='w-full h-full overflow-y-auto'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default PrivateLayout