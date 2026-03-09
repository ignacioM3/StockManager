import type { PropsWithChildren } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


export function PublicLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex flex-col min-h-full">
            <div className="w-full h-full">
                {children}
            </div>
             <ToastContainer
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        aria-label="Notificaciones"
      />
        </div>
    )
}